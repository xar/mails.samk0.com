<template>
    <div class="w-full flex h-full grow">
        <div class="absolute bottom-4 left-0 right-0 z-10 w-7/12">
            <AIPromptInput class="z-10" @update:code="code = $event"/>
        </div>
        <div class="w-7/12 min-h-full relative">
            <MonacoEditor 
                v-model="code" 
                class="h-full"
                :options="editorOptions"
                @load="onEditorMounted"
            />
        </div>
        <div class="w-5/12 p-4 h-full overflow-auto relative">
            <div class="mb-4">
                <details class="bg-white rounded-md shadow p-2">
                    <summary class="font-medium cursor-pointer">
                        Tailwind Configuration
                    </summary>
                    <div class="mt-2">
                        <MonacoEditor
                            v-model="tailwindConfigStr"
                            class="h-48"
                            :options="{
                                ...editorOptions,
                                minimap: { enabled: false },
                            }"
                            @change="updateTailwindConfig"
                        />
                    </div>
                </details>
            </div>

            <div class="w-full flex items-center justify-between pb-2">
                <h1 class="text-lg font-medium ">Preview</h1>
                <UButton class="flex items-center gap-2" @click="copyToClipboard">
                    <Icon name="lucide:copy" class="w-4 h-4" />
                    <span>Copy</span>
                </UButton>
            </div>

            <div class="w-full h-[calc(100vh-200px)] border-2 border-dashed border-gray-200 rounded-md p-4 overflow-auto">
                <div ref="previewContainer"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { useDebounceFn } from '@vueuse/core'
import { onMounted } from 'vue'

const result = useState(() => null)
const code = useState(() => getVueEmailDefaultTemplate());

const isLoading = ref(false);


// Add Tailwind configuration
const defaultTailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: '#007291',
      },
    },
    // Add email-safe units
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
    },
    spacing: {
      px: '1px',
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
    },
  },
};

const tailwindConfigStr = ref(JSON.stringify(defaultTailwindConfig, null, 2));
const tailwindConfig = ref(defaultTailwindConfig);

const updateTailwindConfig = useDebounceFn(() => {
    try {
        tailwindConfig.value = JSON.parse(tailwindConfigStr.value);
    } catch (error) {
        console.error('Invalid Tailwind config:', error);
    }
}, 500);

const debouncedRender = useDebounceFn(async (source: string) => {
    try {
        isLoading.value = true
        result.value = await $fetch('/api/render', {
            method: 'POST',
            body: { 
                source,
                tailwindConfig: tailwindConfig.value 
            }
        })
    } catch (error) {
        console.error('Failed to render:', error)
    } finally {
        isLoading.value = false
    }
}, 500)

// Watch for code changes
watch(code, (newCode) => {
    debouncedRender(newCode)
})

onMounted(() => {
    debouncedRender(code.value)
})

// Configure editor options
const editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
    fontSize: 14,
}

// Handle editor mounting
const onEditorMounted = (editor: monaco.editor.IStandaloneCodeEditor) => {
    console.log('editor mounted')
    
    // Register Vue as a language
    monaco.languages.register({ id: 'vue' })
    
    // Define Vue language configuration
    monaco.languages.setMonarchTokensProvider('vue', {
        defaultToken: '',
        tokenizer: {
            root: [
                [/<\/?([_a-zA-Z][\w.]*)\s*>/, 'tag'],
                [/<\/?([_a-zA-Z][\w.]*)\s*/, 'tag'],
                [/{{/, { token: 'delimiter.curly', next: '@vueInterpolation' }],
                [/"([^"]*)"/, 'attribute.value'],
                [/'([^']*)'/, 'attribute.value'],
                [/[\w\-]+/, 'attribute.name'],
                [/=/, 'delimiter'],
            ],
            vueInterpolation: [
                [/}}/, { token: 'delimiter.curly', next: '@pop' }],
                [/"([^"]*)"/, 'string'],
                [/'([^']*)'/, 'string'],
                [/[\w\-]+/, 'variable'],
                [/[.,;]/, 'delimiter'],
            ],
        }
    })

    // Set the language to Vue
    monaco.editor.setModelLanguage(editor.getModel()!, 'vue')

    // Add basic Vue completion items
    monaco.languages.registerCompletionItemProvider('vue', {
        provideCompletionItems: () => {
            const suggestions =  useVueSuggestions(monaco);
            return { suggestions }
        }
    })
}
const toast = useToast()
const copyToClipboard = () => {
    if (!result.value?.result) return
    navigator.clipboard.writeText(result.value.result);
    toast.add({
        title: 'The email code has been copied to your clipboard.',
        color: 'success',
    })
}

// Add a template ref for the preview container
const previewContainer = ref<HTMLElement | null>(null)

// Create a function to render the preview in shadow DOM
const renderPreviewInShadow = () => {
    if (!previewContainer.value || !result.value?.result) return
    
    let shadow: ShadowRoot
    
    // Check if shadow root already exists
    if (previewContainer.value.shadowRoot) {
        shadow = previewContainer.value.shadowRoot
        // Clear existing content
        shadow.innerHTML = ''
    } else {
        // Create new shadow root if it doesn't exist
        shadow = previewContainer.value.attachShadow({ mode: 'open' })
    }
    
    // Create a container for the email content
    const emailContainer = document.createElement('div')
    emailContainer.innerHTML = result.value.result
    
    // Add the email content to shadow DOM
    shadow.appendChild(emailContainer)
}

// Watch for result changes
watch(() => result.value?.result, () => {
    renderPreviewInShadow()
})


</script>