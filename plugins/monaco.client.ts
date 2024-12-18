import { defineNuxtPlugin } from '#app'
import * as monaco from 'monaco-editor'

export default defineNuxtPlugin(() => {
    // Register custom CSS language features for Tailwind
    monaco.languages.registerCompletionItemProvider('css', {
        provideCompletionItems: () => {
            const vueEmailComponents = [
                'Tailwind',
                'Container',
                'Section',
                'Button',
                'Text',
                'Head',
                'Html',
                'Preview',
                'Row',
                'Column',
                'Img',
                'Link',
                'Hr',
                'Heading',
            ].map(component => ({
                label: component,
                kind: monaco.languages.CompletionItemKind.Class,
                insertText: component,
                detail: `@vue-email/components/${component}`,
                documentation: `A Vue Email ${component} component`
            }));

            const suggestions = [
                ...vueEmailComponents,
                // ... other suggestions
            ]
            return { suggestions }
        }
    })
})