import { ref, onMounted, onUnmounted, computed } from 'vue'
import { SHARED_CONFIG } from '../config/shared.config'
//Composable para manejar breakpoints responsive: mobile y desktop/PC

export function useBreakPoints() {
  // null indica que aún no se midió el ancho

  const windowWidth = ref<number | null>(null)

  function updateDimensions() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  //  se midió el ancho en el cliente
  const isReady = computed(() => windowWidth.value !== null)

  const isMobile = computed(() => {
    //`isMobile` / `isDesktop` son null-safe para evitar hydration mismatches en SSR
    if (windowWidth.value === null) return false
    return windowWidth.value <= SHARED_CONFIG.breakpoints.mobile
  })

  const isDesktop = computed(() => {
    if (windowWidth.value === null) return false
    return windowWidth.value >= SHARED_CONFIG.breakpoints.desktop
  })

  return {
    windowWidth, //- `windowWidth` arranca como `null` (no medido)
    isReady, //`isReady` indica que la medición ya ocurrió (cliente montado)
    isMobile,
    isDesktop,
  }
}
