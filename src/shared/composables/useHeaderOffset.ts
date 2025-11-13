import { onMounted, onBeforeUnmount } from 'vue'

/** calcula dinámicamente la altura del header CSS personalizada (--header-offset).
 * Utiliza ResizeObserver y resize events para mantener actualizada esta medida,
  NO ESTA SIENDO USADO POR AHORA, PERO ES UN BUEN EJEMPLO DE CALCULAR Y MODIFICAR CSS CON JS */

export function useHeaderOffset(options?: { selector?: string; debounceMs?: number }) {
  const selector = options?.selector ?? 'header'
  const debounceMs = options?.debounceMs ?? 100
  let ro: ResizeObserver | null = null
  let rafId = 0
  let timeoutId: any = null

  function setVar(px: number) {
    try {
      document.documentElement.style.setProperty('--header-offset', `${px}px`)
    } catch (e) {
      // sin operación (seguridad para SSR)
    }
  }

  function measureAndSet() {
    if (typeof window === 'undefined') return
    const el = document.querySelector(selector) as HTMLElement | null
    if (!el) {
      // valor por defecto
      setVar(62)
      return
    }

    const height = Math.ceil(el.getBoundingClientRect().height)
    setVar(height)
  }

  function debouncedMeasure() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      // usar requestAnimationFrame para agrupar lecturas/escrituras
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        measureAndSet()
      })
    }, debounceMs)
  }

  onMounted(() => {
    // establecer valor inicial
    measureAndSet()

    if (typeof window === 'undefined') return

    // ResizeObserver sobre el elemento header
    const el = document.querySelector(selector)
    if (el && (window as any).ResizeObserver) {
      ro = new ResizeObserver(debouncedMeasure)
      ro.observe(el)
    }

    // alternativa: evento de redimensionamiento de la ventana
    window.addEventListener('resize', debouncedMeasure, { passive: true })
  })

  onBeforeUnmount(() => {
    if (ro && ro.disconnect) ro.disconnect()
    window.removeEventListener('resize', debouncedMeasure)
    clearTimeout(timeoutId)
    cancelAnimationFrame(rafId)
  })

  // Retorna control opcional para recomputar manualmente
  return {
    recompute: measureAndSet,
  }
}
