<template>
  <div
    class="flex top-0 items-center left-0  space-x-1 right-0 justify-end fixed bg-white rounded-b-[12px] shadow-md border border-neutral-200 z-100 max-w-fit mx-auto px-2 py-1"
  >
    <template v-if="!user">
      <UButton color="neutral" @click.prevent="signInWithGithub()">
        <UIcon name="i-lucide-github" />
        Login with Github
      </UButton>
    </template>
    <template v-else>
      <span class="text-neutral-500 text-xs">{{ user.email }}</span>
      <UButton color="neutral" variant="ghost" @click.prevent="signOut()">
        <UIcon name="i-lucide-log-out" />
      </UButton>
    </template>
  </div>
</template>

<script setup lang="ts">
const { signInWithGithub, signOut, user } = useAuth();
</script>
