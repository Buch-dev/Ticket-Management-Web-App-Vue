<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            @click="goToLanding"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
              <ArrowLeft class="w-5 h-5" />
            </div>
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

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold mb-8">Dashboard</h2>

      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-gray-600 text-sm mb-2">Total Tickets</h3>
          <p class="text-4xl font-bold text-blue-600">{{ stats.total }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-gray-600 text-sm mb-2">Open</h3>
          <p class="text-4xl font-bold text-green-600">{{ stats.open }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-gray-600 text-sm mb-2">In Progress</h3>
          <p class="text-4xl font-bold text-amber-600">{{ stats.inProgress }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md">
          <h3 class="text-gray-600 text-sm mb-2">Closed</h3>
          <p class="text-4xl font-bold text-gray-600">{{ stats.closed }}</p>
        </div>
      </div>

      <button
        @click="goToTickets"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Manage Tickets
      </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, ArrowLeft } from 'lucide-vue-next'
import { storage } from '../utils/storage'

const router = useRouter()

// Get user from localStorage
const user = ref({ name: 'Guest' })
onMounted(() => {
  const session = storage.get('ticketapp_session')
  if (session?.user) user.value = session.user
})

// Get tickets
const tickets = storage.get('ticketapp_tickets') || []

// Computed stats
const stats = computed(() => ({
  total: tickets.length,
  open: tickets.filter(t => t.status === 'open').length,
  inProgress: tickets.filter(t => t.status === 'in_progress').length,
  closed: tickets.filter(t => t.status === 'closed').length
}))

// Navigation methods
const goToLanding = () => router.push('/')
const goToTickets = () => router.push('/tickets')

// Logout
const logout = () => {
  storage.remove('ticketapp_session')
  router.push('/')
}
</script>
