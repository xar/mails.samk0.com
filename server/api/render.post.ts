import { render } from "@vue-email/render";
import { defineComponent } from "vue";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Row,
  Section,
  Text,
  CodeBlock,
  CodeInline,
  Column,
  Font,
  Heading,
  Hr,
  Img,
  Link,
  Markdown,
  Preview,
  Tailwind,
  Style,
} from "@vue-email/components";

interface ParsedSFC {
  template: string | null;
  script: string | null;
  style: string | null;
}

function parseSFC(source: string): ParsedSFC {
  const result: ParsedSFC = {
    template: null,
    script: null,
    style: null,
  };

  // Parse template
  const templateMatch = source.match(/<template>([\s\S]*?)<\/template>/);
  if (templateMatch) {
    result.template = templateMatch[1].trim();
  }

  // Parse script
  const scriptMatch = source.match(/<script.*?>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    result.script = scriptMatch[1].trim();
  }

  // Parse style
  const styleMatch = source.match(/<style.*?>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    result.style = styleMatch[1].trim();
  }

  return result;
}

export default defineEventHandler(async (event) => {
  const { source, props } = await readBody(event);

  if (source) {
    const parsedSFC = parseSFC(source);

    if (!parsedSFC.template) {
      throw createError({
        statusCode: 400,
        message: "No template found in the provided Vue component",
      });
    }

    // Create a dynamic component from the parsed SFC
    const DynamicEmail = defineComponent({
      template: parsedSFC.template,
      props: props || {},
      setup: parsedSFC.script ? new Function(parsedSFC.script) : undefined,
      components: {
        Body,
        Button,
        CodeBlock,
        CodeInline,
        Column,
        Container,
        Font,
        Head,
        Heading,
        Hr,
        Html,
        Row,
        Section,
        Text,
        Img,
        Link,
        Markdown,
        Preview,
        Tailwind,
        Style,
      },
    });

    const emailHtml = await render(DynamicEmail, props || {});
    return {
      result: emailHtml,
    };
  }

  return {
    result: null,
  };
});
