<template>
  <div class="checkout-page">
    <section class="checkout-body">
      <OrderSummary :items="items" :total="total" @remove="handleRemove" />

      <div class="right-col">
        <CheckoutForm @confirm="handleConfirm" @cancel="handleCancel" />
        <div class="processing" v-if="processing">Procesando pago...</div>
        <div class="success" v-if="success">Pago realizado. Redirigiendo...</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cartStore } from '@/domain/cart/stores/cartStore'
import OrderSummary from '@/domain/payment/components/OrderSummary.vue'
import CheckoutForm from '../components/CheckoutForm.vue'

const router = useRouter()
const cart = cartStore()

const items = computed(() => cart.cartItems)
const total = computed(() => cart.totalPrice)

const processing = ref(false)
const success = ref(false)

function handleRemove(id: number) {
  if (typeof cart.removeFromCart === 'function') cart.removeFromCart(id)
}

function handleCancel() {
  router.back()
}

function handleConfirm(formData: any) {
  // Aquí integrarías la pasarela; ahora simulamos
  processing.value = true
  setTimeout(() => {
    if (typeof cart.clearCart === 'function') {
      ;(cart as any).clearCart()
    } else {
      items.value.forEach((it: any) => cart.removeFromCart(it.product.id))
    }
    processing.value = false
    success.value = true
    // después de pago simulado, ir a orders (podemos pasar orderId simulado)
    setTimeout(() => {
      router.push({ path: '/orders' })
    }, 1000)
  }, 1200)
}
</script>

<style scoped>
.checkout-body {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  padding: 1.25rem;
}
.right-col {
  width: 320px;
}
.processing {
  margin-top: 0.75rem;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

@media (max-width: 800px) {
  .checkout-body {
    flex-direction: column;
  }
  .right-col {
    width: 100%;
  }
}
</style>
