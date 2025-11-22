import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { logger } from "@/shared/services/logger";
import type { ProductInterface } from "../interfaces";

export const useProductsStore = defineStore('products', () => {

  // Estado interno (privado)
  const _productsList = ref<ProductInterface[]>([]);
  const _selectedProductDTO = ref<ProductInterface | null>(null);
  const _selectedProductId = ref<number | null>(null);

  // Getters (computed)
  const productsList = computed(() => _productsList.value);
  const selectedProductDTO = computed(() => _selectedProductDTO.value);
  const selectedProductId = computed(() => _selectedProductId.value);

  // Actions
  const setProductsList = (products: ProductInterface[]) => {
    logger.debug(`[productsStore] setProductsList: ${products.length} items`);
    _productsList.value = products;
  };

  const selectProduct = (product: ProductInterface) => {
    logger.debug(`[productsStore] selectProduct: ${product.id}`);
    _selectedProductId.value = product.id;
    _selectedProductDTO.value = product;
  };

  const selectProductById = (id: number) => {
    logger.debug(`[productsStore] selectProductById: ${id}`);
    _selectedProductId.value = id;
    // Intentar encontrarlo en la lista actual primero
    const found = _productsList.value.find(p => p.id === id);
    if (found) {
      _selectedProductDTO.value = found;
    } else {
      logger.warn(`[productsStore] selectProductById: Product with id ${id} not found in current list.`);
      _selectedProductDTO.value = null;
    }
  };

  const resetSelection = () => {
    logger.debug('[productsStore] resetSelection');
    _selectedProductDTO.value = null;
    _selectedProductId.value = null;
  };

  const resetStore = () => {
    logger.debug('[productsStore] resetStore');
    _productsList.value = [];
    _selectedProductDTO.value = null;
    _selectedProductId.value = null;
  };

  return {
    // Getters (readonly computed)
    productsList,
    selectedProductDTO,
    selectedProductId,
    // Actions
    setProductsList,
    selectProduct,
    selectProductById,
    resetSelection,
    resetStore,
  };
});
