<template>
  <aside class="payment-actions">
    <div class="product-query" v-if="productId">Producto : {{ productId }}</div>
    <button class="pay-btn" :disabled="disabled" @click="$emit('pay')">
      <slot>{{ processing ? 'Procesando...' : 'Pagar' }}</slot>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  disabled?: boolean
  processing?: boolean
  success?: boolean
  productId?: string
}>()

const disabled = props.disabled ?? false
const processing = props.processing ?? false
const success = props.success ?? false
const productId = props.productId ?? ''
</script>

<style scoped>
.payment-actions {
  width: 220px;
}
.pay-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.pay-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.success {
  margin-top: 0.75rem;
  color: #0a8a0a;
}

@media (max-width: 800px) {
  .payment-actions {
    width: 100%;
  }
}
</style>
