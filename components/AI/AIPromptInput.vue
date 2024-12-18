<template>
  <div class="max-w-fit flex left-0 right-0  bottom-4 mx-auto">
    <div
      class="relative min-w-[320px] flex items-end w-full bg-gradient-to-r from-yellow-400 overflow-hidden via-pink-500 to-purple-500 p-[2px] rounded-[12px]"
    >
      <template v-if="user?.id">
        <textarea
          v-model="prompt"
          :disabled="state === 'loading'"
          placeholder="What email do you want to generate?"
          class="w-full px-4 py-2 min-w-[180px] bg-white rounded-l-[10px] outline-none resize-none placeholder:text-gray-400 focus:ring-0"
        ></textarea>
        <div class="h-full bg-white flex items-end pr-1 rounded-r-[10px]">
          <Button
            @click="generateEmail"
            class="mb-1 bg-neutral-900 flex items-center justify-center w-8 h-8 shrink-0 text-white rounded-full"
          >
            <Icon
              v-if="state === 'idle'"
              name="lucide:arrow-up"
              class="w-4 h-4"
            />
            <Icon v-else name="lucide:loader" class="w-4 h-4 animate-spin" />
          </Button>
        </div>
      </template>
      <div
        v-else
        class="bg-white rounded-[10px] p-2 space-y-1 justify-center flex flex-col items-center"
      >
        <p>You need to be logged in to generate emails.</p>
        <UButton color="neutral" @click.prevent="signInWithGithub()">
          <UIcon name="i-lucide-github" />
          Login with Github
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const prompt = useState(() => "");
const result = useState(() => "");
const emit = defineEmits(["update:code"]);
const state = useState(() => "idle");
const { user, signInWithGithub } = useAuth();

const generateEmail = async () => {
  state.value = "loading";
  const response = await $fetch("/api/ai/generate-email", {
    method: "POST",
    body: { prompt: prompt.value },
  });

  result.value = response.result;
  state.value = "idle";
};

const templateResult = computed(() => {
  const code = result.value.match(/<email_code>([\s\S]*?)<\/email_code>/)?.[1] || '';
  if (!code.trim()) return '';
  
  // Check if code is already wrapped in <template> tags
  if (code.trim().startsWith('<template>') && code.trim().endsWith('</template>')) {
    return code;
  }
  
  // Wrap code in <template> tags if not already wrapped
  return `<template>${code}</template>`;
});

watch(templateResult, (newResult) => {
  emit("update:code", newResult);
});
</script>
