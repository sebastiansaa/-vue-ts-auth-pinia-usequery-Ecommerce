<template>
  <div class="product-main">
    <ProductMainDesktop v-if="isDesktop" :product="product" />
    <ProductMainMobile v-else :product="product" />
  </div>
</template>

<script setup lang="ts">
import ProductMainMobile from './ProductMainMobile.vue'
import ProductMainDesktop from './ProductMainDesktop.vue'
import { useBreakPoints } from '../../../../../../shared/composables'
import type { ProductInterface } from '../../../interfaces'

const { isDesktop } = useBreakPoints()

const props = defineProps<{
  product: ProductInterface
}>()
</script>

<style scoped>
.product-main {
  width: 100%;
}
</style>
