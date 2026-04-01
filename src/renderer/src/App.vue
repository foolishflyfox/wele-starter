<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <button :disabled="loading" @click="fetchHello">
        {{ loading ? 'Loading...' : 'Call API Hello' }}
      </button>
    </div>
  </div>
  <div v-if="result" class="result">
    <h3>API Response:</h3>
    <pre>{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
  <div v-if="error" class="error">
    <h3>Error:</h3>
    <p>{{ error }}</p>
  </div>
  <Versions />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const result = ref<Record<string, string> | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchHello = async (): Promise<void> => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('/api/hello')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    result.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    result.value = null
  } finally {
    loading.value = false
  }
}
</script>
