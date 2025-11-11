<template>
  <div>
    <NavMobile v-if="isReady && isMobile" />
    <NavDesktop v-else-if="isReady && !isMobile" />
    <Skeleton v-else />
    <div class="nav-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import NavDesktop from './desktop/NavDesktop.vue'
import NavMobile from './mobile/NavMobile.vue'
import { useBreakPoints } from '@/shared/composables'
import { Skeleton } from '@/shared/components/layout'

const { isMobile, isReady } = useBreakPoints()
</script>

<style scoped></style>
