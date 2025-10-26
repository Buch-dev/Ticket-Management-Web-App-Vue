<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
    <Toast
      v-if="toast"
      :message="toast.message"
      :type="toast.type"
      @close="toast = null"
    />

    <!-- Go Back Button -->
    <button
      @click="router.push('/')"
      class="fixed top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors group"
    >
      <div
        class="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all group-hover:-translate-x-1"
      >
        <ArrowLeft size="20" />
      </div>
      <span class="hidden sm:inline">Back to Home</span>
    </button>

    <div class="max-w-md w-full">
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-gray-600">
            {{
              mode === 'login'
                ? 'Enter your credentials to access your account'
                : 'Sign up to get started with TicketFlow'
            }}
          </p>
        </div>

        <!-- Form -->
        <div class="space-y-5">
          <div v-if="mode === 'signup'">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              v-model="formData.name"
              placeholder="John Doe"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p
              v-if="errors.name"
              class="text-red-500 text-sm mt-1.5 flex items-center gap-1"
            >
              <span>⚠</span> {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="you@example.com"
              @keypress.enter="handleSubmit"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p
              v-if="errors.email"
              class="text-red-500 text-sm mt-1.5 flex items-center gap-1"
            >
              <span>⚠</span> {{ errors.email }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              v-model="formData.password"
              placeholder="••••••••"
              @keypress.enter="handleSubmit"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p
              v-if="errors.password"
              class="text-red-500 text-sm mt-1.5 flex items-center gap-1"
            >
              <span>⚠</span> {{ errors.password }}
            </p>
          </div>

          <button
            @click="handleSubmit"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {{ mode === 'login' ? 'Sign In' : 'Create Account' }}
          </button>
        </div>

        <!-- Toggle Mode -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            {{ mode === 'login' ? "Don't have an account? " : "Already have an account? " }}
            <button
              @click="router.push({ name: mode === 'login' ? 'signup' : 'login' })"
              class="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
            >
              {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
            </button>
          </p>
        </div>
      </div>

      <p class="text-center text-sm text-gray-500 mt-6">
        By continuing, you agree to TicketFlow's Terms of Service and Privacy Policy
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import Toast from '../components/Toast.vue'
import { storage } from '../utils/storage'

const router = useRouter()

const props = defineProps({
  mode: {
    type: String,
    required: true
  }
})

const formData = ref({ email: '', password: '', name: '' })
const errors = ref({})
const toast = ref(null)

const validate = () => {
  const newErrors = {}
  if (!formData.value.email) newErrors.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(formData.value.email))
    newErrors.email = 'Email is invalid'
  if (!formData.value.password)
    newErrors.password = 'Password is required'
  else if (formData.value.password.length < 6)
    newErrors.password = 'Password must be at least 6 characters'
  if (props.mode === 'signup' && !formData.value.name)
    newErrors.name = 'Name is required'
  return newErrors
}

const handleSubmit = () => {
  const newErrors = validate()
  errors.value = newErrors

  if (Object.keys(newErrors).length > 0) return

  if (props.mode === 'login') {
    const users = storage.get('ticketapp_users') || []
    const user = users.find(
      (u) =>
        u.email === formData.value.email &&
        u.password === formData.value.password
    )

    if (user) {
      const token = 'token_' + Date.now()
      storage.set('ticketapp_session', {
        token,
        user: { email: user.email, name: user.name },
      })
      toast.value = { message: 'Login successful!', type: 'success' }
      setTimeout(() => router.push('/dashboard'), 1000)
    } else {
      toast.value = { message: 'Invalid credentials. Please try again.', type: 'error' }
    }
  } else {
    const users = storage.get('ticketapp_users') || []
    if (users.find((u) => u.email === formData.value.email)) {
      toast.value = { message: 'Email already exists', type: 'error' }
      return
    }
    users.push({
      email: formData.value.email,
      password: formData.value.password,
      name: formData.value.name,
    })
    storage.set('ticketapp_users', users)
    toast.value = { message: 'Account created! Please login.', type: 'success' }
    setTimeout(() => router.push('/login'), 1500)
  }
}
</script>

