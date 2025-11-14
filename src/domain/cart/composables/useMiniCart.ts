import { ref, computed } from 'vue'

/** Composable  controla el estado del mini-cart: 'closed' | 'mini' | 'expanded'
 * usa computed (readOnly ) y expone isOpen, isMini, isExpanded(metodos)
*/

const state = ref<'closed' | 'mini' | 'expanded'>('closed')

export function useMiniCart() {
  const isOpen = computed(() => state.value !== 'closed')
  const isMini = computed(() => state.value === 'mini')
  const isExpanded = computed(() => state.value === 'expanded')

  function openMini() {
    state.value = 'mini'
  }

  function openExpanded() {
    state.value = 'expanded'
  }

  function expand() {
    if (state.value === 'mini') state.value = 'expanded'
  }

  function close() {
    state.value = 'closed'
  }

  return {
    state,
    isOpen,
    isMini,
    isExpanded,
    openMini,
    openExpanded,
    expand,
    close,
  }
}
