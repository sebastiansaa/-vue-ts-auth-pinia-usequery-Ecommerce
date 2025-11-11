<template>
  <div class="product-detail">
    <ProductMain v-if="productStore.selectedProductDTO" />
    <Skeleton v-else-if="isLoading" height="400px" />
    <div v-else-if="error">Error al cargar producto</div>
  </div>
</template>

<script setup lang="ts">
import ProductMain from '../components/component/main/ProductMain.vue'
import { useRoute } from 'vue-router'
import { useProductById } from '../composables/useProductById'
import { watch, computed } from 'vue'
import { useProductStore } from '../stores/index'
import { Skeleton } from '@/shared/components/layout'

const route = useRoute()

//  id reactivo para que cambie cuando cambia la ruta
const id = computed(() => Number(route.params.id))
const { data: product, isLoading, error } = useProductById(id)
const productStore = useProductStore()

// Sincroniza el producto obtenido por el composable (reactivo y asíncrono) con el store.
// Cuando el producto cambia (por la carga asíncrona), lo guarda en el store.
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      productStore.selectProduct(newProduct)
    }
  },
  { immediate: true },
)
</script>

<style scoped></style>
