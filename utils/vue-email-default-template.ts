export function getVueEmailDefaultTemplate() {
  return `<template>
  <Tailwind>
    <Container>
      <Section>
        <Text class="text-black text-lg">
          Welcome to Vue Email Editor
        </Text>
        <Button 
          href="https://example.com" 
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Click me
        </Button>
      </Section>
    </Container>
  </Tailwind>
</template>
    `;
}
