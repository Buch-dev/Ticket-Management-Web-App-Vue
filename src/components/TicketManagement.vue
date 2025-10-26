<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Toast -->
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />

    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            @click="router.push('/dashboard')"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
              <ArrowLeft class="w-5 h-5" />
            </div>
            <span>Back to Dashboard</span>
          </button>
          <h1 class="text-2xl font-bold text-blue-600">TicketFlow</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">Welcome, {{ user?.name }}</span>
          <button
            @click="logout"
            class="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut class="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold">Ticket Management</h2>
        <button
          @click="openForm"
          class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus class="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <!-- Ticket Form -->
      <div v-if="showForm" class="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 class="text-xl font-bold mb-4">{{ editingTicket ? 'Edit Ticket' : 'Create New Ticket' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Title *</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Status *</label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <p v-if="errors.status" class="text-red-500 text-sm mt-1">{{ errors.status }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Priority</label>
              <select
                v-model="formData.priority"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="handleSubmit"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {{ editingTicket ? 'Update' : 'Create' }}
            </button>
            <button
              @click="cancelForm"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Ticket List -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="ticket in tickets"
          :key="ticket.id"
          class="bg-white p-6 rounded-xl shadow-md"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-bold">{{ ticket.title }}</h3>
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-semibold',
                getStatusColor(ticket.status)
              ]"
            >
              {{ ticket.status.replace('_', ' ') }}
            </span>
          </div>
          <p v-if="ticket.description" class="text-gray-600 text-sm mb-4">
            {{ ticket.description }}
          </p>
          <div class="flex gap-2">
            <button
              @click="handleEdit(ticket)"
              class="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Edit2 class="w-4 h-4" /> Edit
            </button>
            <button
              @click="deleteConfirm = ticket.id"
              class="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 class="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="tickets.length === 0 && !showForm" class="text-center py-12">
        <p class="text-gray-500 text-lg">No tickets yet. Create your first ticket!</p>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div
      v-if="deleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-xl max-w-md">
        <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
        <p class="mb-6">Are you sure you want to delete this ticket? This action cannot be undone.</p>
        <div class="flex gap-2">
          <button
            @click="handleDelete(deleteConfirm)"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            @click="deleteConfirm = null"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-16">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2025 TicketFlow. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowLeft, Plus, Edit2, Trash2, LogOut } from 'lucide-vue-next'
import Toast from '../components/Toast.vue'
import { storage } from '../utils/storage'
import router from '../router'

const tickets = ref(storage.get('ticketapp_tickets') || [])
const showForm = ref(false)
const editingTicket = ref(null)
const deleteConfirm = ref(null)
const toast = ref(null)
const errors = ref({})
const user = ref(null)

const formData = ref({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
})

onMounted(() => {
  const session = storage.get('ticketapp_session')
  user.value = session?.user || { name: 'Guest' }
})

const openForm = () => {
  showForm.value = true
  editingTicket.value = null
  formData.value = { title: '', description: '', status: 'open', priority: 'medium' }
}

const cancelForm = () => {
  showForm.value = false
  editingTicket.value = null
  errors.value = {}
}

const validate = () => {
  const newErrors = {}
  if (!formData.value.title.trim()) newErrors.title = 'Title is required'
  if (!['open', 'in_progress', 'closed'].includes(formData.value.status))
    newErrors.status = 'Invalid status'
  return newErrors
}

const handleSubmit = () => {
  const newErrors = validate()
  errors.value = newErrors
  if (Object.keys(newErrors).length > 0) return

  const updatedTickets = [...tickets.value]
  if (editingTicket.value) {
    const index = updatedTickets.findIndex(t => t.id === editingTicket.value.id)
    updatedTickets[index] = { ...formData.value, id: editingTicket.value.id }
    toast.value = { message: 'Ticket updated successfully', type: 'success' }
  } else {
    updatedTickets.push({ ...formData.value, id: Date.now() })
    toast.value = { message: 'Ticket created successfully', type: 'success' }
  }

  storage.set('ticketapp_tickets', updatedTickets)
  tickets.value = updatedTickets
  cancelForm()
}

const handleEdit = (ticket) => {
  editingTicket.value = ticket
  formData.value = { ...ticket }
  showForm.value = true
}

const handleDelete = (id) => {
  tickets.value = tickets.value.filter(t => t.id !== id)
  storage.set('ticketapp_tickets', tickets.value)
  deleteConfirm.value = null
  toast.value = { message: 'Ticket deleted successfully', type: 'success' }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-800'
    case 'in_progress': return 'bg-amber-100 text-amber-800'
    case 'closed': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const logout = () => {
  storage.remove('ticketapp_session')
  router.push('/')
}
</script>
