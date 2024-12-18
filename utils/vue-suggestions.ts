import * as monaco from 'monaco-editor'
export function useVueSuggestions(editor: typeof monaco) {
    return [
        {
            label: 'template',
            kind: editor.languages.CompletionItemKind.Snippet,
            insertText: '<template>\n\t$0\n</template>',
            insertTextRules: editor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Vue template block'
        },
        {
            label: 'script',
            kind: editor.languages.CompletionItemKind.Snippet,
            insertText: '<script setup lang="ts">\n\t$0\n</script>',
            insertTextRules: editor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Vue script setup block'
        },
        {
            label: 'v-if',
            kind: editor.languages.CompletionItemKind.Property,
            insertText: 'v-if="$0"',
            insertTextRules: editor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Vue v-if directive'
        },
        {
            label: 'v-for',
            kind: editor.languages.CompletionItemKind.Property,
            insertText: 'v-for="$1 in $2"',
            insertTextRules: editor.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Vue v-for directive'
        }
    ];
}