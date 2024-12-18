import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export default defineEventHandler(async (event: any) => {
  const { user } = await getUser(event);
  if (!user) throw new Error("Unauthorized");
  const apiKey =
    useRuntimeConfig(event).googleGeminiApiKey ??
    process.env.NUXT_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Google Gemini API key");

  const google = createGoogleGenerativeAI({
    apiKey,
  });
  const { prompt, existingCode } = await readBody(event);

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `
You are an AI assistant tasked with generating email code for a SaaS company based on a user's description of the type of email they want. You have access to the following documentation:
<documentation>
---
title: HTML
description: A Vue html component to wrap emails.
---

## Getting started

Add the component to your email template. Include styles where needed.
<template>
  <Html lang="en" dir="ltr">
    <Button href="https://example.com" style="color: #61dafb">
      Click me
    </Button>
  </Html>
</template>


## Props

::field-group
  ::field{name="lang" type="string" default="'en'"}
  Identify the language of text content on the email
  ::

  ::field{name="dir" type="string" default="'ltr'"}
  Identify the direction of text content on the email
  ::
::
---
title: Tailwind
description: A Vue component to wrap emails with Tailwind CSS.
---

## Getting started

Add the component to your email template. Include styles where needed.
<template>
  <Tailwind 
    :config="{
      theme: {
        extend: {
          colors: {
            brand: '#007291',
          },
        },
      },
    }"
  >
    <Button href="https://example.com" class="bg-brand px-3 py-2 font-medium leading-4 text-white">
      Click me
    </Button>
  </Tailwind>
</template>

## Props

::field-group
  ::field{name="config" type="object"}
  Customize the default theme for your project with the available properties in Tailwind docs.
  ::
::

::callout{icon="i-heroicons-light-bulb"}
Most email clients are style-limited and some styles may not work.
<br/><br/>
One example of this is how Tailwind uses rem as its main unit for better accessibility. This is not supported by [some email clients](https://www.caniemail.com/features/css-unit-rem/), if you want you can override the Tailwind config.
<br/><br/>
We can’t really apply this configuration for you as it would have a few drawbacks. In the future, we will probably provide a preset to remediate this. But, for now, here’s a good starter configuration you can use to avoid these issues:

import type { TailwindConfig } from "@vue-email/tailwind";

export default {
  theme: {
    fontSize: {
      xs: ["12px", { lineHeight: "16px" }],
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "28px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
      "4xl": ["36px", { lineHeight: "36px" }],
      "5xl": ["48px", { lineHeight: "1" }],
      "6xl": ["60px", { lineHeight: "1" }],
      "7xl": ["72px", { lineHeight: "1" }],
      "8xl": ["96px", { lineHeight: "1" }],
      "9xl": ["144px", { lineHeight: "1" }],
    },
    spacing: {
      px: "1px",
      0: "0",
      0.5: "2px",
      1: "4px",
      1.5: "6px",
      2: "8px",
      2.5: "10px",
      3: "12px",
      3.5: "14px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "36px",
      10: "40px",
      11: "44px",
      12: "48px",
      14: "56px",
      16: "64px",
      20: "80px",
      24: "96px",
      28: "112px",
      32: "128px",
      36: "144px",
      40: "160px",
      44: "176px",
      48: "192px",
      52: "208px",
      56: "224px",
      60: "240px",
      64: "256px",
      72: "288px",
      80: "320px",
      96: "384px",
    },
  },
} satisfies TailwindConfig;

::
---
title: Head
description: Contains head components, related to the document such as style and meta elements.
---
::

## Getting started

Add the component to your email template. Include styles where needed.

<template>
   <Head>
      <title>My email title</title>
   </Head>
</template>

---
title: Style
description: A Style component used to add styles to the document.
---
## Getting started

<template>
  <Head>
    <title>Email title</title>
    <meta name="description" content="Description">
    <Style>
      body { background-color: #fff; }
    </Style>
  </Head>
</template>

---
title: Button
description: A link that is styled to look like a button.
---

::callout{icon="i-ph-info-bold"}
Semantics: Quite often in the email world we talk about buttons, when actually we mean links. Behind the scenes this is a <a> tag, that is styled like a <button> tag.
::

## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <Button href="https://example.com" style="color: #61dafb; padding: 10px 20px;">
    Click me
  </Button>
</template>

## Props

::field-group
  ::field{name="href" type="string" required="true"}
  Link to be triggered when the button is clicked
  ::

  ::field{name="target" type="string" default="_blank"}
  Specify the target attribute for the button link
  ::
::
---
title: Container
description: A layout component that centers all the email content.
---


## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <Container>
    <Button href="https://example.com" style="color: #61dafb;">
      Click me
    </Button>
  </Container>
</template>
---
title: Code Block
description: Display code using Shiki syntax highlighter.

links:
  - label: Shiki Documentation
    icon: i-heroicons-arrow-top-right-on-square-20-solid
    to: https://shiki.style/
---

## Getting started

Add the component to your email template. Include styles where needed.

<script setup lang="ts">

const code = export default async (req, res) => {
  try {
    const html = await renderAsync(
      EmailTemplate({ firstName: 'John' })
    );
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
</script>

<template>
  <CodeBlock 
    :code="code" 
    lang="typescript" 
    theme="min-dark" 
    show-line-numbers 
    :highlighted-lines="[3, 4, 5]" 
  />
</template>

## Props

::field-group
  ::field{name="code" type="string" required="true"}
  The code that should be displayed
  ::

  ::field{name="lang" type="string" required="true"}
  The language of the code, see [Languages](https://shiki.style/languages) for a list of all supported languages
  ::

  ::field{name="theme" type="string" required="true"}
  The theme of the code block, see [Themes](https://shiki.style/themes) for a list of all supported themes
  ::

  ::field{name="showLineNumbers" type="boolean" default="false"}
  If true, line numbers will be displayed.
  ::

  ::field{name="lineNumberColor" type="string" default="#636E7B"}
  The color of the line numbers.
  ::

  ::field{name="highlightedLines" type="Array<number>" default="[]"}
  An array of line numbers that should be highlighted.
  ::

  ::field{name="lineHighlightingColor" type="String" default="rgba(101, 117, 133, .16)"}
  The background color of the highlighted lines.
  ::
::
---
title: Code Inline
description: Display a predictable inline code HTML element that works on all email clients.
---

## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <CodeInline>@vue-email/code-inline</CodeInline>
</template>
---
title: Column
description: Display a column that separates content areas vertically in your email.
---
## Getting started

Add the component to your email template. Include styles where needed.

<script setup lang="ts">
import { Column, Row } from '@vue-email/components'
</script>

<template>
  <Row>
    <Column>A</Column>
    <Column>B</Column>
    <Column>C</Column>
  </Row>
</template>
---
title: Row
description: Display a row that separates content areas horizontally in your email.

---
## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <Section>
    <Row>
      <Column>A</Column>
    </Row>
    <Row>
      <Column>B</Column>
    </Row>
    <Row>
      <Column>C</Column>
    </Row>
  </Section>
</template>

---
title: Font
description: A Vue Font component to set your fonts.
---
## Getting started

Add the component to your email template. This applies your font to all tags inside your email. Note, that not all email clients supports web fonts, this is why it is important to configure your 'fallbackFontFamily'. To view all email clients that supports web fonts see


<template>
  <Html lang="en">
    <Head>
      <Font
        font-family="Roboto"
        fallback-font-family="Verdana"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          format: 'woff2',
        }"
        :font-weight="400"
        font-style="normal"
      />
    </Head>
  </Html>
</template>

## Props

::field-group
  ::field{name="fontFamily" type="string"}
  The font family you want to use. If the webFont property is configured, this should contain the name of that font
  ::

  ::field{name="fallbackFontFamily" type="string"}
  The fallback font family the system should use if web fonts are not supported or the chosen font is not installed on the system.
  ::

  ::field{name="webFont" type="{url: string, format: string} | undefined"}
  The webFont the supported email client should use
  ::

  ::field{name="fontWeight" type="number | string"}
  The weight of the font
  ::

  ::field{name="fontStyle" type="string"}
  The style of the font
  ::
::
---
title: Heading
description: A block of heading text.
---
## Getting started

Add the component to your email template. Include styles where needed.
<template>
  <Heading as="h2">Lorem ipsum</Heading>
</template>

## Props

::field-group
  ::field{name="as" type="string"}
  Render component as 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'.
  ::

  ::field{name="m" type="string"}
  A shortcut for 'margin' CSS property.
  ::

  ::field{name="mx" type="string"}
  A shortcut for 'margin-left' and 'margin-right' CSS properties.
  ::

  ::field{name="my" type="string"}
  A shortcut for 'margin-top' and 'margin-bottom' CSS properties.
  ::

  ::field{name="mt" type="string"}
  A shortcut for 'margin-top' CSS property.
  ::

  ::field{name="mr" type="string"}
  A shortcut for 'margin-right' CSS property.
  ::

  ::field{name="mb" type="string"}
  A shortcut for 'margin-bottom' CSS property.
  ::

  ::field{name="ml" type="string"}
  A shortcut for 'margin-left' CSS property.
  ::
::
---
title: Hr
description: Display a divider that separates content areas in your email.
---
## Getting started

Add the component to your email template. Include styles where needed.
<template>
  <Hr />
</template>
---
title: Image
description: Display an image in your email.
---

## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <Img src="cat.jpg" alt="Cat" width="300" height="300" />
</template>

::callout{icon="i-heroicons-exclamation-triangle"}
All email clients can display '.png', '.gif', and '.jpg' images. Unfortunately, '.svg' images are not well supported, regardless of how they're referenced, so avoid using these. See Can I Email for more information.
::

::field-group
  ::field{name="alt" type="string"}
  Alternate description for an image
  ::

  ::field{name="src" type="string"}
  The path to the image
  ::

  ::field{name="width" type="string"}
  The width of an image in pixels
  ::

  ::field{name="height" type="string"}
  The height of an image in pixels
  ::
::

---
title: Link
description: A hyperlink to web pages, email addresses, or anything else a URL can address.
---

## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <Link href="https://example.com">Example</Link>
</template>

## Props

::field-group
  ::field{name="href" type="string" required="true"}
  Link to be triggered when the button is clicked
  ::

  ::field{name="target" type="string" default="'_blank'"}
  Specify the target attribute for the button link
  ::
::
---
title: Markdown
description: A Markdown component that converts markdown to valid vue-email template code
---

## Getting started

Add the component to your email template. Include styles where needed.

<script setup lang="ts">
const md = '# Hello, World!'
</script>

<template>
  <Html lang="en" dir="ltr">
    <Markdown
      :markdown-custom-styles="{
        h1: { color: 'red' },
        h2: {
          color: 'blue',
        },
        codeInline: {
          background: 'grey',
        },
      }"
      :markdown-container-styles="{
        padding: '12px',
        border: 'solid 1px black',
      }"
      :source="md"
    />
  </Html>
</template>

## Props

::field-group
  ::field{name="source" type="string" required="true"}
  Contains the markdown content that will be rendered in the email template
  ::

  ::field{name="ContainerStyles" type="string" default="'{}'"}
  Provide custom styles for the containing div that wraps the markdown content
  ::

  ::field{name="CustomStyles" type="string" default="'{}'"}
  Provide custom styles for the corresponding HTML element (p, h1, h2, etc.)
  ::
::

::callout{icon="i-heroicons-light-bulb"}
Note: Passing a custom style for an element overrides the default styles.
::
---
title: Preview
description: A preview text that will be displayed in the inbox of the recipient.
---

::callout{icon="i-ph-info-bold"}
Email clients have this concept of “preview text” which gives insight into what's inside the email before you open. A good practice is to keep that text under 90 characters.
::

## Getting started

Add the component to your email template. Include styles where needed.


<template>
  <Preview>Email preview text</Preview>
</template>
---
title: Section
description: Display a section that can be formatted using columns.
---
## Getting started

Add the component to your email template. Include styles where needed.

<template>
  <!-- A simple 'section' -->
  <Section>
    <Text>Hello World</Text>
  </Section>

  <!-- Formatted with 'rows' and 'columns' -->
  <Section>
    <Row>
      <Column>Column 1, Row 1</Column>
      <Column>Column 2, Row 1</Column>
    </Row>
    <Row>
      <Column>Column 1, Row 2</Column>
      <Column>Column 2, Row 2</Column>
    </Row>
  </Section>
</template>
---
title: Text
description: A block of text separated by blank spaces.
---
## Getting started

Add the component to your email template. Include styles where needed.
<template>
  <Text>Lorem ipsum</Text>
</template>
</documentation>

<existing_code>
${existingCode ?? "No code provided"}
</existing_code>

Your task is to generate email code that matches the user's description while adhering to the guidelines and best practices outlined in the documentation. Follow these steps:
1. Carefully read and analyze the user's description of the email type they want.
2. Review the documentation to ensure you understand the available components, styles, and best practices for creating emails.
3. Plan out the structure and content of the email based on the user's description and the documentation guidelines.
4. Generate the email code using provided components.
5. Use inline styles!
6. Don't send imports only use <script></script> block only when really necessary!
7. Always inline paddings!
8. Use engaging and interesting copywriting if no specific instructions are provided!

The user has provided the following description of the email type they want:
<email_type>
${prompt}
</email_type>
Using this description and the provided documentation, generate the appropriate email code. Be sure to include all necessary elements such as header, body, footer, and any specific components mentioned in the user's description or required by the documentation.
Present your response in the following format:

<email_code>
[Insert the generated code for the email here]
</email_code>

<explanation>
[Provide a brief explanation of the key elements included in the email code and how they align with the user's description and the documentation guidelines]
</explanation>

Remember to follow best practices for email design and coding. Ensure that the code is well-commented for clarity and maintainability.
`,
  });

  return { result: text.replaceAll("```", "").replaceAll("```html", "") };
});
