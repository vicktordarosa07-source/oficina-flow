/**
 * WhatsApp adapter — mock para MVP.
 * Substitua por Z-API ou Evolution API quando integrar.
 */

export interface WhatsAppMessage {
  phone: string;
  message: string;
  /** URL do PDF para enviar como documento */
  pdfUrl?: string;
}

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Mock: envia mensagem via WhatsApp.
 * Em produção, substitua pelo fetch real para Z-API ou Evolution API.
 */
export async function sendWhatsAppMessage(
  data: WhatsAppMessage
): Promise<WhatsAppResult> {
  console.log("[WhatsApp Mock] Enviando mensagem:", {
    phone: data.phone,
    message: data.message.substring(0, 100) + "...",
    pdfUrl: data.pdfUrl,
  });

  // Simula delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock: sempre retorna sucesso
  return {
    success: true,
    messageId: `mock_${Date.now()}`,
  };
}

/**
 * Mock: gera link do WhatsApp Web.
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/55${cleaned}?text=${encoded}`;
}

/**
 * Mock: envia orçamento como mensagem formatada.
 */
export async function sendOrcamentoWhatsApp(data: {
  phone: string;
  clienteNome: string;
  veiculoInfo: string;
  valorTotal: number;
  linkAprovacao: string;
}): Promise<WhatsAppResult> {
  const message = [
    `Olá ${data.clienteNome}! 👋`,
    "",
    `Segue o orçamento para seu ${data.veiculoInfo}:`,
    `💰 Valor total: R$ ${data.valorTotal.toFixed(2)}`,
    "",
    `Para aprovar ou recusar, acesse:`,
    data.linkAprovacao,
    "",
    `OficinaFlow — Nunca mais perca um orçamento.`,
  ].join("\n");

  return sendWhatsAppMessage({
    phone: data.phone,
    message,
  });
}
