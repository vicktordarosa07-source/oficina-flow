import type { Orcamento, OrcamentoItem, Cliente, Veiculo } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * Gera o conteúdo HTML do orçamento para PDF.
 * Usado pelo react-pdf ou pode ser impresso direto.
 */
export function generateOrcamentoHTML(
  orcamento: Orcamento,
  cliente: Cliente,
  veiculo: Veiculo,
  itens: OrcamentoItem[],
  oficina: { nome: string; cnpj?: string | null; telefone?: string | null; endereco?: string | null }
): string {
  const itensHTML = itens
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          ${item.descricao}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.tipo === "peca" ? "Peça" : "Mão de Obra"}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantidade}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.valor_unitario)}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
          ${formatCurrency(item.valor_total)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #f97316; }
        .info-box { background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
        .info-box h3 { margin: 0 0 8px 0; font-size: 14px; color: #666; text-transform: uppercase; }
        .info-box p { margin: 2px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f97316; color: white; padding: 10px 8px; text-align: left; font-size: 13px; }
        td { font-size: 13px; }
        .total { text-align: right; font-size: 20px; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #eee; font-size: 12px; color: #999; text-align: center; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .status-aprovado { background: #dcfce7; color: #16a34a; }
        .status-pendente { background: #fef9c3; color: #ca8a04; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">${oficina.nome}</div>
          ${oficina.cnpj ? `<p style="font-size: 12px; color: #666;">CNPJ: ${oficina.cnpj}</p>` : ""}
          ${oficina.telefone ? `<p style="font-size: 12px; color: #666;">Tel: ${oficina.telefone}</p>` : ""}
          ${oficina.endereco ? `<p style="font-size: 12px; color: #666;">${oficina.endereco}</p>` : ""}
        </div>
        <div style="text-align: right;">
          <p style="font-size: 12px; color: #666;">Orçamento #${orcamento.id.slice(0, 8)}</p>
          <p style="font-size: 12px; color: #666;">Data: ${formatDate(orcamento.criado_em)}</p>
          <span class="status ${orcamento.status === "aprovado" ? "status-aprovado" : "status-pendente"}">
            ${orcamento.status === "aprovado" ? "APROVADO" : "PENDENTE"}
          </span>
        </div>
      </div>

      <div style="display: flex; gap: 20px;">
        <div class="info-box" style="flex: 1;">
          <h3>Cliente</h3>
          <p><strong>${cliente.nome}</strong></p>
          ${cliente.telefone ? `<p>Tel: ${cliente.telefone}</p>` : ""}
          ${cliente.email ? `<p>Email: ${cliente.email}</p>` : ""}
        </div>
        <div class="info-box" style="flex: 1;">
          <h3>Veículo</h3>
          <p><strong>${veiculo.marca} ${veiculo.modelo}</strong></p>
          <p>Placa: ${veiculo.placa}</p>
          ${veiculo.ano ? `<p>Ano: ${veiculo.ano}</p>` : ""}
          ${veiculo.km ? `<p>KM: ${veiculo.km.toLocaleString("pt-BR")}</p>` : ""}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th style="text-align: center;">Tipo</th>
            <th style="text-align: center;">Qtd</th>
            <th style="text-align: right;">Valor Unit.</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itensHTML}
        </tbody>
      </table>

      <div class="total">
        Valor Total: ${formatCurrency(orcamento.valor_total)}
      </div>

      ${
        orcamento.observacoes
          ? `<div class="info-box">
              <h3>Observações</h3>
              <p>${orcamento.observacoes}</p>
            </div>`
          : ""
      }

      <div class="footer">
        <p>Orçamento gerado pelo OficinaFlow — Nunca mais perca um orçamento por esquecimento.</p>
        <p>Este orçamento é válido por 7 dias a partir da data de emissão.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Abre o orçamento em nova aba para impressão/PDF.
 */
export function openOrcamentoForPrint(html: string) {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}
