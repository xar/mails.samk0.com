<template>
  <div v-if="!user?.id && !isClosed" class="fixed w-screen h-screen inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100]">
    <div class="bg-white p-8 rounded-lg max-w-md w-full shadow-xl">
      <h1 class="text-2xl font-bold mb-4">Create Better Emails</h1>
      
      <p class="text-gray-600 mb-6">
        Join us to unlock all features and save your work:
      </p>

      <div class="space-y-4">
        <button @click="signInWithGithub()" 
                class="w-full cursor-pointer bg-black text-white py-3 px-4 rounded-lg hover:bg-black/80 transition flex items-center justify-center gap-2">
          <Icon name="lucide:github" size="20" />
          Continue with GitHub
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button @click="isClosed = true"
                class="w-full border cursor-pointer border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition">
          Continue Without Account
        </button>
      </div>

      <p class="mt-4 text-sm text-gray-500">
        * Anonymous mode: Your work won't be saved and AI features will be unavailable
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
const { user, signInWithGithub } = useAuth();
const isClosed = useLocalStorage('marketing-overlay', false);
</script>

