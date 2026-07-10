interface WhatsAppConfig {
  phoneNumberId: string;
  apiToken: string;
}

interface WhatsAppTemplateParam {
  type: "text";
  text: string;
}

export async function sendWhatsAppMessage(
  config: WhatsAppConfig,
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: JSON.stringify(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function sendWhatsAppTemplate(
  config: WhatsAppConfig,
  to: string,
  templateName: string,
  languageCode: string,
  params: WhatsAppTemplateParam[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components: [
            {
              type: "body",
              parameters: params,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: JSON.stringify(error) };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export function buildFormSummaryMessage(
  formTitle: string,
  answers: { fieldTitle: string; value: string }[],
  submissionDate: string
): string {
  const lines = [
    `📋 New Response: ${formTitle}`,
    `📅 ${submissionDate}`,
    "",
    ...answers.map((a) => `${a.fieldTitle}: ${a.value}`),
  ];
  return lines.join("\n");
}
