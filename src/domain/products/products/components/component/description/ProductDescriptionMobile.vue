<template>
  <div class="product-description-mobile">
    <h2 class="product-title">{{ product?.title ?? '' }}</h2>
    <p class="product-price">
      <strong>{{ product?.price ?? '' }} USD</strong>
    </p>
    <p class="product-description">
      {{ product?.description || 'noDescription' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '../../../stores'

const productStore = useProductStore()
const product = productStore.selectedProductDTO
</script>

<style scoped>
.product-description-mobile {
  padding: 1.25rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-title {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.product-price {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
}

.product-price strong {
  font-weight: 700;
}

.product-description {
  color: #555;
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (min-width: 600px) and (max-width: 1023px) {
  .product-description-mobile {
    padding: 2rem;
  }

  .product-title {
    font-size: 1.75rem;
  }

  .product-price {
    font-size: 1.75rem;
  }

  .product-description {
    font-size: 1rem;
  }
}
</style>
