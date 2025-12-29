import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGetCart, useAddItemToCart, useUpdateItemQuantity, useRemoveItem, useClearCart } from '../app/hooks'
import type { CartDTO } from '../types/BackendShapeCart'
import type { ProductResponse } from '@/domain/products/types'
import { FindProductByIdUsecase } from '@/domain/products/app/usecases'
import type { CartItem } from '../types'

// Gestiona el estado del carrito de compras de manera centralizada y reactiva

export const useCartStore = defineStore('cart', () => {
  // Estado
  const cart = ref<CartDTO | null>(null)
  const isLoading = ref(false)
  const productCache = ref<Record<number, ProductResponse>>({})

  // Getters
  const totalItems = computed(() => cart.value?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0)
  const totalPrice = computed(() => cart.value?.total ?? 0)

  const cartItems = computed(() => {
    return (cart.value?.items.map(item => ({
      ...item,
      product: productCache.value[item.productId] || undefined,
    })) || []) as CartItem[]
  })

  // Actions
  const { data: cartData, refetch } = useGetCart()

  const getCart = async () => {
    isLoading.value = true
    try {
      await refetch()
      cart.value = cartData.value || null
      if (cart.value) {
        await hydrateProducts(cart.value.items.map(i => i.productId))
      }
    } finally {
      isLoading.value = false
    }
  }

  const hydrateProducts = async (ids: number[]) => {
    const missing = ids.filter(id => !productCache.value[id])
    await Promise.all(
      missing.map(async (id) => {
        try {
          const product = await new FindProductByIdUsecase().execute(id)
          if (product) productCache.value[id] = product
        } catch (error) {
          console.warn(`Unable to hydrate product ${id}`, error)
        }
      })
    )
  }

  const { mutateAsync: addItemMutation } = useAddItemToCart()
  const addItem = async (productId: number, quantity: number = 1) => {
    await addItemMutation({ productId, quantity })
    await getCart() // Refrescar
  }

  const { mutateAsync: updateQuantityMutation } = useUpdateItemQuantity()
  const updateQuantity = async (productId: number, quantity: number) => {
    await updateQuantityMutation({ productId, quantity })
    await getCart()
  }

  const { mutateAsync: removeItemMutation } = useRemoveItem()
  const removeItem = async (productId: number) => {
    await removeItemMutation(productId)
    await getCart()
  }

  const { mutateAsync: clearCartMutation } = useClearCart()
  const clearCart = async () => {
    await clearCartMutation()
    cart.value = null
    productCache.value = {}
  }

  return {
    cart,
    isLoading,
    totalItems,
    totalPrice,
    cartItems,
    getCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
