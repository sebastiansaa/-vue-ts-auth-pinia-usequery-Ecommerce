<template>
  <div class="product-main-desktop">
    <div class="gallery-section">
      <ProductGallery
        :images="product.images"
        :description="product.description"
        :product="product"
      />
    </div>
    <div class="details-section">
      <ProductDescription :product="product" />
      <div class="actions-section">
        <AddToCart :product="product" />
      </div>
    </div>
    <div class="related-section">
      <ProductRelated :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductGallery from '../gallery/ProductGallery.vue'
import ProductDescription from '../description/ProductDescription.vue'
import ProductRelated from '../related/ProductRelated.vue'
import type { ProductInterface } from '../../../interfaces'

const props = defineProps<{
  product: ProductInterface
}>()
</script>

<style scoped></style>
