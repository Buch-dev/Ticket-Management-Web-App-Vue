<template>
  <div
    class="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white"
    :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
  >
    <component :is="type === 'success' ? CheckCircle : AlertCircle" size="20" />
    <span>{{ message }}</span>
    <button @click="emit('close')" class="ml-2">
      <X size="16" />
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { AlertCircle, CheckCircle, X } from "lucide-vue-next";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success", // or 'error'
  },
});

const emit = defineEmits(["close"]);

let timer;
onMounted(() => {
  timer = setTimeout(() => emit("close"), 3000);
});
onUnmounted(() => {
  clearTimeout(timer);
});
</script>
