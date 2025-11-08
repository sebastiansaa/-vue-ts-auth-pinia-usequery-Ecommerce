<template>
  <div class="product-detail">
    <ProductMain v-if="product" :product="product" />
    <div v-else-if="isLoading">Cargando...</div>
    <div v-else-if="error">Error al cargar producto</div>
  </div>
</template>

<script setup lang="ts">
import ProductMain from '../components/component/main/ProductMain.vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductById } from '../composables/useProductById'

const route = useRoute()
const router = useRouter()

const id = Number(route.params.id)
const { data: product, isLoading, error } = useProductById(id)
</script>

<style scoped></style>
