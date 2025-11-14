<template>
  <div class="checkout-form">
    <h2>Datos del comprador</h2>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label>Nombre completo</label>
        <input v-model="form.fullName" required />
      </div>
      <div class="field">
        <label>Dirección de envío</label>
        <input v-model="form.address" required />
      </div>
      <div class="field">
        <label>Teléfono</label>
        <input v-model="form.phone" inputmode="tel" required />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>

      <h3>Datos de tarjeta</h3>
      <div class="field">
        <label>Número de tarjeta</label>
        <input
          v-model="form.cardNumber"
          inputmode="numeric"
          maxlength="19"
          placeholder="4444 4444 4444 4444"
          required
        />
      </div>
      <div class="row">
        <div class="field small">
          <label>Expiración</label>
          <input v-model="form.expiry" placeholder="MM/AA" required />
        </div>
        <div class="field small">
          <label>CVV</label>
          <input v-model="form.cvv" inputmode="numeric" maxlength="4" required />
        </div>
      </div>

      <div class="actions">
        <button type="button" class="btn secondary" @click="$emit('cancel')">Volver</button>
        <button type="submit" class="btn primary">Pagar ahora</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const emit = defineEmits(['confirm', 'cancel'])

const form = reactive({
  fullName: '',
  address: '',
  phone: '',
  email: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
})

function onSubmit() {
  emit('confirm', { ...form })
}
</script>

<style scoped>
.checkout-form {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.field {
  margin-bottom: 0.75rem;
}
.field label {
  display: block;
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 0.25rem;
}
.field input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.row {
  display: flex;
  gap: 0.5rem;
}
.small {
  flex: 1;
}
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn {
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn.primary {
  background: #007bff;
  color: #fff;
}
.btn.secondary {
  background: #f0f0f0;
}

@media (max-width: 800px) {
  .row {
    flex-direction: column;
  }
}
</style>
