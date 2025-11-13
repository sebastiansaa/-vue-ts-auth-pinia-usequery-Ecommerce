import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProductInterface } from "../interfaces";

export const useProductStore = defineStore('productStores', () => {

  const productsList = ref<ProductInterface[]>([]);
  const selectedProductDTO = ref<ProductInterface | null>(null);
  const selectedProductId = ref<number | null>(null);

  const setProductsList = (products: ProductInterface[]) => {
    productsList.value = products;
  };

  const selectProduct = (product: ProductInterface) => {
    selectedProductId.value = product.id;
    selectedProductDTO.value = product;
  };

  const selectProductById = (id: number) => {
    selectedProductId.value = id;
    selectedProductDTO.value = null;
  };

  return {
    productsList, // lista global de productos para el grid
    selectedProductDTO, // Producto seleccionado para la vista de detalle (Este es el DTO completo)
    selectedProductId, // id producto seleccionado
    setProductsList, // Actualiza la lista cuando cambia de categoría
    selectProduct, //Guarda el producto seleccionado al navegar al detalle
    selectProductById,
  };
});
