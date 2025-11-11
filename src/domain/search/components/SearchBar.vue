<template>
  <div class="search-bar">
    <SearchInput
      v-model="searchTerm"
      placeholder="Buscar productos..."
      @submit="handleSearch"
      @focus="onFocus"
      @blur="hideDropdown"
      @clear="clearSearch"
    />

    <SearchDropdown
      :visible="showDropdown"
      :results="results || []"
      :isLoading="isLoading"
      @select="selectProduct"
    />
  </div>
</template>

<script setup lang="ts">
import { useSearch } from '../componsables/useSearch'
import { useProductNavigation } from '../../products/products/composables'
import { ref, computed, unref } from 'vue'
import type { ProductInterface } from '../../products/products/interfaces'
import SearchDropdown from './SearchDropdown.vue'
import SearchInput from './SearchInput.vue'

const {
  searchTerm: searchTermRef,
  setSearchTerm,
  clearSearch,
  results,
  isLoading,
} = useSearch({ debounceMs: 200 })
const { navigateToProduct } = useProductNavigation()

// Computed writable para que v-model funcione correctamente con el store
const searchTerm = computed({
  get: () => unref(searchTermRef),
  set: (val) => setSearchTerm(val),
})

const showDropdown = ref(false)

const onFocus = () => {
  showDropdown.value = true
}

const handleSearch = () => {}

const selectProduct = (product: ProductInterface) => {
  navigateToProduct(product)
  showDropdown.value = false
  clearSearch()
}

const hideDropdown = () => {
  showDropdown.value = false
}
</script>

<style scoped>
.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}

/* Responsive */
@media (max-width: 640px) {
  .search-bar {
    max-width: 100%;
  }
}
</style>
