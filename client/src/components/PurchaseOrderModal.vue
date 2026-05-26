<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && backlogItem" class="modal-overlay" @click="close">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ mode === 'create' ? 'Create Purchase Order' : 'Purchase Order Details' }}
            </h3>
            <button class="close-button" @click="close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Item summary -->
            <div class="item-summary">
              <div class="item-summary-info">
                <div class="item-name">{{ translateProductName(backlogItem.item_name) }}</div>
                <div class="item-sku">SKU: {{ backlogItem.item_sku }}</div>
              </div>
              <span class="priority-badge" :class="backlogItem.priority.toLowerCase()">
                {{ backlogItem.priority }} Priority
              </span>
            </div>

            <!-- Create mode: form -->
            <form v-if="mode === 'create'" class="po-form" @submit.prevent="submitPO">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="supplier-name">Supplier Name</label>
                  <input
                    id="supplier-name"
                    v-model="form.supplier_name"
                    type="text"
                    class="form-input"
                    placeholder="Enter supplier name"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="quantity">Quantity</label>
                  <input
                    id="quantity"
                    v-model.number="form.quantity"
                    type="number"
                    class="form-input"
                    min="1"
                    required
                  />
                  <span class="form-hint">Shortage: {{ shortage }} units</span>
                </div>

                <div class="form-group">
                  <label class="form-label" for="unit-cost">Unit Cost ($)</label>
                  <input
                    id="unit-cost"
                    v-model.number="form.unit_cost"
                    type="number"
                    class="form-input"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="expected-delivery">Expected Delivery Date</label>
                  <input
                    id="expected-delivery"
                    v-model="form.expected_delivery_date"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-group form-group-full">
                <label class="form-label" for="notes">Notes <span class="optional">(optional)</span></label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-input form-textarea"
                  placeholder="Additional notes..."
                  rows="3"
                ></textarea>
              </div>

              <div v-if="totalCost > 0" class="cost-summary">
                <span class="cost-label">Total Order Cost</span>
                <span class="cost-value">{{ formatCost(totalCost) }}</span>
              </div>

              <div v-if="submitError" class="submit-error">{{ submitError }}</div>
            </form>

            <!-- View mode: read-only details -->
            <div v-else-if="mode === 'view'">
              <div v-if="viewLoading" class="view-loading">Loading purchase order...</div>
              <div v-else-if="viewError" class="view-error">{{ viewError }}</div>
              <div v-else-if="existingPO" class="po-details">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Supplier</div>
                    <div class="info-value">{{ existingPO.supplier_name }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">PO ID</div>
                    <div class="info-value mono">{{ existingPO.id }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Quantity</div>
                    <div class="info-value">{{ existingPO.quantity }} units</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Unit Cost</div>
                    <div class="info-value">{{ formatCost(existingPO.unit_cost) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Total Cost</div>
                    <div class="info-value highlight">{{ formatCost(existingPO.quantity * existingPO.unit_cost) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Status</div>
                    <div class="info-value">
                      <span class="status-badge" :class="existingPO.status.toLowerCase()">
                        {{ existingPO.status }}
                      </span>
                    </div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Expected Delivery</div>
                    <div class="info-value">{{ formatDate(existingPO.expected_delivery_date) }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Created Date</div>
                    <div class="info-value">{{ formatDate(existingPO.created_date) }}</div>
                  </div>
                </div>
                <div v-if="existingPO.notes" class="notes-section">
                  <div class="info-label">Notes</div>
                  <div class="notes-content">{{ existingPO.notes }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" @click="close">Close</button>
            <button
              v-if="mode === 'create'"
              class="btn-primary"
              :disabled="submitting"
              @click="submitPO"
            >
              {{ submitting ? 'Creating...' : 'Create Purchase Order' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { api } from '../api'
import { useI18n } from '../composables/useI18n'

const { translateProductName } = useI18n()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  backlogItem: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (v) => ['create', 'view'].includes(v)
  }
})

const emit = defineEmits(['close', 'po-created'])

// Computed shortage for pre-fill hint
const shortage = computed(() => {
  if (!props.backlogItem) return 0
  return props.backlogItem.quantity_needed - props.backlogItem.quantity_available
})

// Create mode form state
const form = ref({
  supplier_name: '',
  quantity: 0,
  unit_cost: '',
  expected_delivery_date: '',
  notes: ''
})

const submitting = ref(false)
const submitError = ref(null)

const totalCost = computed(() => {
  const qty = Number(form.value.quantity)
  const cost = Number(form.value.unit_cost)
  if (!qty || !cost) return 0
  return qty * cost
})

// View mode state
const existingPO = ref(null)
const viewLoading = ref(false)
const viewError = ref(null)

// Reset form when modal opens or backlogItem changes
watch(
  () => [props.isOpen, props.backlogItem, props.mode],
  ([isOpen, item, mode]) => {
    if (!isOpen || !item) return

    if (mode === 'create') {
      // Pre-fill quantity with shortage amount
      form.value = {
        supplier_name: '',
        quantity: shortage.value > 0 ? shortage.value : 1,
        unit_cost: '',
        expected_delivery_date: '',
        notes: ''
      }
      submitting.value = false
      submitError.value = null
    } else if (mode === 'view') {
      loadExistingPO(item.id)
    }
  },
  { immediate: true }
)

const loadExistingPO = async (backlogItemId) => {
  viewLoading.value = true
  viewError.value = null
  existingPO.value = null
  try {
    existingPO.value = await api.getPurchaseOrderByBacklogItem(backlogItemId)
  } catch (err) {
    viewError.value = 'Failed to load purchase order details.'
    console.error(err)
  } finally {
    viewLoading.value = false
  }
}

const submitPO = async () => {
  if (submitting.value) return
  submitting.value = true
  submitError.value = null

  try {
    const payload = {
      backlog_item_id: props.backlogItem.id,
      supplier_name: form.value.supplier_name,
      quantity: form.value.quantity,
      unit_cost: form.value.unit_cost,
      expected_delivery_date: form.value.expected_delivery_date,
      notes: form.value.notes || null
    }
    const result = await api.createPurchaseOrder(payload)
    emit('po-created', result)
    close()
  } catch (err) {
    submitError.value = 'Failed to create purchase order. Please try again.'
    console.error(err)
  } finally {
    submitting.value = false
  }
}

const close = () => {
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCost = (value) => {
  if (value == null || isNaN(value)) return '$0.00'
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  max-width: 640px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Item summary bar */
.item-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.item-sku {
  font-size: 0.813rem;
  color: #64748b;
  font-family: 'Monaco', 'Courier New', monospace;
}

.priority-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  flex-shrink: 0;
}

.priority-badge.high {
  background: #fecaca;
  color: #991b1b;
}

.priority-badge.medium {
  background: #fed7aa;
  color: #92400e;
}

.priority-badge.low {
  background: #dbeafe;
  color: #1e40af;
}

/* Form */
.po-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.optional {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: #94a3b8;
}

.form-input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.cost-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.cost-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e40af;
}

.cost-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
}

.submit-error {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #dc2626;
}

/* View mode */
.view-loading,
.view-error {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.view-error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.info-value {
  font-size: 0.938rem;
  color: #0f172a;
  font-weight: 500;
}

.info-value.mono {
  font-family: 'Monaco', 'Courier New', monospace;
  color: #2563eb;
  font-size: 0.813rem;
}

.info-value.highlight {
  color: #2563eb;
  font-weight: 700;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.ordered {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.delivered {
  background: #f0fdf4;
  color: #166534;
}

.status-badge.cancelled {
  background: #f1f5f9;
  color: #475569;
}

.notes-section {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notes-content {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Footer */
.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.625rem 1.25rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.btn-primary {
  padding: 0.625rem 1.25rem;
  background: #2563eb;
  border: 1px solid transparent;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
