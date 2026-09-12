"use client";

import { use } from "react";
import { useOrcamentoByToken } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, Wrench } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  generateOrcamentoHTML,
  openOrcamentoForPrint,
} from "@/lib/adapters/pdf";

export default function OrcamentoPublicoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { data: orcamento, isLoading, error } = useOrcamentoByToken(token);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-8">
            <p className="text-lg font-medium">Orçamento não encontrado</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Este link pode ter expirado ou ser inválido.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handlePrint() {
    if (!orcamento || !orcamento.cliente || !orcamento.veiculo) return;
    const html = generateOrcamentoHTML(
      orcamento,
      orcamento.cliente,
      orcamento.veiculo,
      orcamento.itens || [],
      { nome: "OficinaFlow" }
    );
    openOrcamentoForPrint(html);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Print button */}
      <div className="fixed top-4 right-4 z-10">
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir / PDF
        </Button>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">OficinaFlow</span>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Orçamento #{orcamento.id.slice(0, 8)}</p>
            <p>{formatDate(orcamento.criado_em)}</p>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Cliente + Veículo */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Cliente
            </h3>
            <p className="font-medium">{orcamento.cliente?.nome}</p>
            {orcamento.cliente?.telefone && (
              <p className="text-sm text-muted-foreground">
                Tel: {orcamento.cliente.telefone}
              </p>
            )}
            {orcamento.cliente?.email && (
              <p className="text-sm text-muted-foreground">
                Email: {orcamento.cliente.email}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Veículo
            </h3>
            <p className="font-medium">
              {orcamento.veiculo?.marca} {orcamento.veiculo?.modelo}
            </p>
            <p className="text-sm text-muted-foreground">
              Placa: {orcamento.veiculo?.placa}
            </p>
            {orcamento.veiculo?.ano && (
              <p className="text-sm text-muted-foreground">
                Ano: {orcamento.veiculo.ano}
              </p>
            )}
          </div>
        </div>

        {/* Itens */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b-2 border-foreground">
              <th className="py-2 text-left">Descrição</th>
              <th className="py-2 text-center">Tipo</th>
              <th className="py-2 text-center">Qtd</th>
              <th className="py-2 text-right">Valor Unit.</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.itens?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.descricao}</td>
                <td className="py-3 text-center">
                  {item.tipo === "peca" ? "Peça" : "Mão de Obra"}
                </td>
                <td className="py-3 text-center">{item.quantidade}</td>
                <td className="py-3 text-right">
                  {formatCurrency(item.valor_unitario)}
                </td>
                <td className="py-3 text-right font-medium">
                  {formatCurrency(item.valor_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-xl font-bold mb-8">
          Total: {formatCurrency(orcamento.valor_total)}
        </div>

        {orcamento.observacoes && (
          <div className="rounded-md bg-gray-50 p-4 mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
              Observações
            </h3>
            <p className="text-sm">{orcamento.observacoes}</p>
          </div>
        )}

        <Separator className="mb-6" />

        <p className="text-center text-xs text-muted-foreground">
          Orçamento válido por 7 dias a partir da data de emissão.
          <br />
          OficinaFlow — Nunca mais perca um orçamento por esquecimento.
        </p>
      </div>
    </div>
  );
}
