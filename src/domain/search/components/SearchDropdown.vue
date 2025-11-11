<template>
  <div v-if="visible" class="search-dropdown" @mousedown.prevent>
    <div v-if="isLoading" class="dropdown-loading">
      <Skeleton v-for="n in 4" :key="n" height="48px" />
    </div>

    <div v-else-if="results && results.length > 0">
      <div
        v-for="product in results.slice(0, 5)"
        :key="product.id"
        @click="selectProduct(product)"
        class="dropdown-item"
      >
        <img :src="product.images[0]" :alt="product.title" class="dropdown-image" />
        <div class="dropdown-content">
          <div class="dropdown-title">{{ product.title }}</div>
          <div class="dropdown-price">${{ product.price }}</div>
        </div>
      </div>

      <div v-if="results.length > 5" class="dropdown-footer">
        <span class="dropdown-count">{{ results.length - 5 }} más resultados...</span>
      </div>
    </div>

    <div v-else class="dropdown-empty">
      <p class="empty-message">No se encontraron productos</p>
      <p class="empty-hint">Intenta con otro término de búsqueda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductInterface } from '../../products/products/interfaces'
import { Skeleton } from '@/shared/components/layout'

interface Props {
  visible: boolean
  results: ProductInterface[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [product: ProductInterface]
}>()

const selectProduct = (product: ProductInterface) => {
  emit('select', product)
}

const isLoading = props.isLoading ?? false
const results = props.results ?? []
</script>

<style scoped>
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-image {
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.dropdown-content {
  flex: 1;
  min-width: 0;
}

.dropdown-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
}

.dropdown-footer {
  padding: 0.5rem 1rem;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.dropdown-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.dropdown-empty {
  padding: 2rem 1rem;
  text-align: center;
}

.empty-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 640px) {
  .search-dropdown {
    max-height: 300px;
  }

  .dropdown-item {
    padding: 0.5rem 0.75rem;
  }

  .dropdown-image {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
