<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import NavComponent from './shared/components/navigation/nav/NavComponent.vue'
import { getProducts } from './domain/products/products/services/getProducts'

const queryClient = useQueryClient()

// Prefetch products
onMounted(() => {
  queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 30,
  })
})
</script>

<template>
  <header>
    <NavComponent />
  </header>
  <div id="app-content">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
body {
  background: #ece9e2;
  margin: 0;
  padding: 0;
}

#app-content {
  background: transparent;
  padding-top: 62px;
}

@media (max-width: 1023px) {
  #app-content {
    padding-top: 56px;
  }
}
main {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
