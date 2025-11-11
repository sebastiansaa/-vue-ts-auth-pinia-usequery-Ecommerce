<template>
  <nav class="nav">
    <div class="nav__section nav__section--left">
      <LogoButton />
    </div>

    <div class="nav__section nav__section--center">
      <SearchBar />
    </div>

    <div class="nav__section nav__section--right">
      <IconButton class="icon-btn-nav-desktop" aria-label="Carrito" @click="handleSection('cart')">
        <ShoppingCartIcon class="nav-icon" />
      </IconButton>
    </div>
  </nav>
  <NavDesktopCat />
</template>

<script setup lang="ts">
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { IconButton, LogoButton } from '@/shared/components/ui/actions/buttons'
import SearchBar from '@/domain/search/components/SearchBar.vue'
//import { SearchBar } from '@/domain/products/search/components'
import NavDesktopCat from './NavDesktopCat.vue'
import { useNavigation } from '@/shared/composables/useNavigation'

const { handleSection } = useNavigation()
</script>

<style scoped>
.nav-icon {
  width: 24px;
  height: 24px;
  color: #222; /* neutral stroke color for outline */
  fill: none; /* ensure no fill, only stroke */
}

.icon-btn-nav-desktop {
  padding: 0.5rem;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-btn-nav-desktop:hover {
  background: #f0f0f0;
}

.nav__section--center {
  flex: 2;
  display: flex;
  justify-content: center;
}
.nav__section--left {
  flex: 1;
  display: flex;
  align-items: center;
}
.nav__section--right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Make desktop nav fixed to top so it doesn't scroll with the page */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 62px; /* matches NavDesktopCat top offset */
  padding: 0.5rem 1rem;
  background: #f8f8f8;
  border-bottom: 1px solid #eee;
}
</style>
