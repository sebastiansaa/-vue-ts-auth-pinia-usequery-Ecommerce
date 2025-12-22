import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { logger } from "@/shared/services/logger";
import { useAuthStore } from "@/domain/auth/stores/authStore";
import type { ProductInterface } from "@/domain/products/interfaces";
import { getProductById } from "@/domain/products/services";
import {
  addItemToCart,
  clearCart as clearCartService,
  getCart,
  removeItemFromCart,
  updateCartItemQuantity,
  type Cart,
} from "../services";
import type { CartItem } from "@/domain/cart/interface";
import {
  clearCartStorage,
  loadCartSnapshot,
  saveCartSnapshot,
} from "@/domain/cart/helpers/cartLocalAdapter";
import { useToast } from "vue-toastification";

export const cartStore = defineStore("cartStore", () => {
  const auth = useAuthStore();

  const cart = ref<Cart | null>(loadCartSnapshot());
  const productCache = ref<Record<number, ProductInterface>>({});
  const loading = ref(false);
  const toast = useToast();

  const isAuthenticated = computed(() => auth.isLogged);

  const cartItems = computed<CartItem[]>(() => hydrateCartItems(cart.value));
  const totalPrice = computed(() => cart.value?.total ?? 0);
  const count = computed(() =>
    cart.value?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );

  function hydrateCartItems(current: Cart | null): CartItem[] {
    if (!current) return [];
    return current.items.map((item) => {
      const product = productCache.value[item.productId];
      const price = item.price ?? product?.price ?? 0;
      return {
        productId: item.productId,
        product,
        quantity: item.quantity,
        price,
        lineTotal: item.lineTotal ?? price * item.quantity,
      } satisfies CartItem;
    });
  }

  function setCart(next: Cart | null) {
    cart.value = next;
    if (!next) {
      clearCartStorage();
      return;
    }
    saveCartSnapshot(next);
    void hydrateMissingProducts(next);
  }

  async function hydrateMissingProducts(next: Cart): Promise<void> {
    const missing = next.items
      .map((it) => it.productId)
      .filter((id) => !productCache.value[id]);

    if (!missing.length) return;
    await hydrateIndividually(missing);
  }

  async function hydrateIndividually(ids: number[]): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        try {
          const product = await getProductById(id);
          if (product) productCache.value[id] = product;
        } catch (error) {
          logger.warn(`[cartStore] Unable to hydrate product ${id}`, error as Error);
        }
      })
    );
  }

  async function safeGetRemoteCart(): Promise<Cart | null> {
    try {
      return await getCart();
    } catch (error) {
      logger.warn(`[cartStore] getCart failed`, error as Error);
      return null;
    }
  }

  function ensureLocalCart(): Cart {
    if (cart.value) return cart.value;
    const now = new Date().toISOString();
    const empty: Cart = { id: 'local-cart', userId: 'guest', items: [], total: 0, createdAt: now, updatedAt: now };
    setCart(empty);
    return empty;
  }

  function upsertLocalItem(product: ProductInterface, quantity: number): Cart {
    const current = ensureLocalCart();
    const items = [...current.items];
    const idx = items.findIndex(i => i.productId === product.id);
    const price = product.price;
    const nextQty = Math.max(1, quantity);
    if (idx === -1) {
      items.push({ productId: product.id, quantity: nextQty, price, lineTotal: price * nextQty });
    } else {
      items[idx] = { productId: product.id, quantity: nextQty, price, lineTotal: price * nextQty };
    }
    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const now = new Date().toISOString();
    const next: Cart = { ...current, items, total, updatedAt: now };
    setCart(next);
    productCache.value[product.id] = product;
    return next;
  }

  function removeLocalItem(productId: number): void {
    if (!cart.value) return;
    const items = cart.value.items.filter(i => i.productId !== productId);
    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const now = new Date().toISOString();
    setCart({ ...cart.value, items, total, updatedAt: now });
  }

  function updateLocalQuantity(productId: number, quantity: number): void {
    if (!cart.value) return;
    const normalized = Math.max(1, Math.trunc(quantity));
    const items = cart.value.items.map(i => i.productId === productId ? { ...i, quantity: normalized, lineTotal: i.price * normalized } : i);
    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const now = new Date().toISOString();
    setCart({ ...cart.value, items, total, updatedAt: now });
  }

  async function syncRemoteWithLocalSnapshot(): Promise<void> {
    if (!isAuthenticated.value) return;
    const localSnapshot = cart.value;
    let remote = await safeGetRemoteCart();

    if (localSnapshot && localSnapshot.items.length) {
      for (const item of localSnapshot.items) {
        try {
          await addItemToCart(item.productId, item.quantity);
        } catch (error) {
          logger.warn(`[cartStore] sync add item failed`, error as Error);
        }
      }
      remote = await safeGetRemoteCart();
    }

    if (remote) {
      setCart(remote);
    }
  }

  async function addToCart(product: ProductInterface, quantity = 1): Promise<void> {
    loading.value = true;
    try {
      if (!isAuthenticated.value) {
        if (product.stock !== undefined && quantity > product.stock) {
          toast.error('Sin stock suficiente');
          return;
        }
        upsertLocalItem(product, quantity);
        return;
      }
      const updated = await addItemToCart(product.id, quantity);
      if (product) productCache.value[product.id] = product;
      if (updated) setCart(updated);
    } finally {
      loading.value = false;
    }
  }

  async function removeFromCart(productId: number): Promise<void> {
    loading.value = true;
    try {
      if (!isAuthenticated.value) {
        removeLocalItem(productId);
        return;
      }
      const updated = await removeItemFromCart(productId);
      if (updated) setCart(updated);
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(productId: number, quantity: number): Promise<void> {
    const normalized = Math.max(0, Math.trunc(quantity));
    if (normalized === 0) {
      await removeFromCart(productId);
      return;
    }
    loading.value = true;
    try {
      if (!isAuthenticated.value) {
        updateLocalQuantity(productId, normalized);
        return;
      }
      const updated = await updateCartItemQuantity(productId, normalized);
      if (updated) setCart(updated);
    } finally {
      loading.value = false;
    }
  }

  async function clearCart(): Promise<void> {
    loading.value = true;
    try {
      if (!isAuthenticated.value) {
        setCart({ id: 'local-cart', userId: 'guest', items: [], total: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        return;
      }
      await clearCartService();
      setCart({ id: cart.value?.id ?? 'remote-cart', userId: auth.user?.id ?? 'user', items: [], total: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    } finally {
      loading.value = false;
    }
  }

  async function syncCart(): Promise<void> {
    if (!isAuthenticated.value) return;
    await syncRemoteWithLocalSnapshot();
  }

  // Hydrate products for initial snapshot (if any)
  if (cart.value) {
    void hydrateMissingProducts(cart.value);
  }

  return {
    cartItems,
    totalPrice,
    count,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    isAuthenticated,
  };
});
