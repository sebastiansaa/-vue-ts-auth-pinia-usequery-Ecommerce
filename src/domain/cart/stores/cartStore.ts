import type { ProductInterface } from "@/domain/products/products/interfaces";
import type { CartItem } from "@/domain/cart/interface";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { loadCartFromStorage, saveCartToStorage } from "@/domain/cart/helpers/cartPersistence";
import { logger } from "@/shared/services/logger";

export const cartStore = defineStore('cartStore', () => {

  // Estado interno (privado)
  const _cartItems = ref<CartItem[]>([]);
  const _totalPrice = ref<number>(0);

  // Getters (computed)
  const cartItems = computed(() => _cartItems.value);
  const totalPrice = computed(() => _totalPrice.value);
  const count = computed(() => _cartItems.value.reduce((s, it) => s + (it.quantity || 0), 0));

  // Automatización: Recálculo y Persistencia
  watch(_cartItems, (items) => {
    // Recalcular total
    _totalPrice.value = items.reduce((total, item) => {
      const price = Number(item.product?.price ?? 0);
      return total + price * (item.quantity ?? 0);
    }, 0);

    // Persistir
    saveCartToStorage(items);
  }, { deep: true });

  // Actions públicas
  const addToCart = (product: ProductInterface) => {
    logger.debug(`[cartStore] addToCart: ${product.id}`);
    const existingItem = _cartItems.value.find(item => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      _cartItems.value.push({ product, quantity: 1 });
    }
  }

  const removeFromCart = (id: number) => {
    logger.debug(`[cartStore] removeFromCart: ${id}`);
    const index = _cartItems.value.findIndex(item => item.product.id === id);
    //Si lo encuentra el item "(index !== -1)", lo elimina
    if (index !== -1) {
      _cartItems.value.splice(index, 1);
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    logger.debug(`[cartStore] updateQuantity: ${id}, quantity: ${quantity}`);
    const item = _cartItems.value.find(item => item.product.id === id);
    if (!item) return; // Si no se encuentra el item, salir
    item.quantity = Math.max(0, Math.trunc(quantity)); // Evitar cantidades negativas y decimales
    if (item.quantity === 0) {
      removeFromCart(id);
    }
  }

  const clearCart = () => {
    logger.debug('[cartStore] clearCart');
    _cartItems.value = [];
  }

  // Inicializar el store cargando datos del storage
  _cartItems.value = loadCartFromStorage();

  return {
    // Getters (readonly computed)
    cartItems,
    totalPrice,
    count,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
});
