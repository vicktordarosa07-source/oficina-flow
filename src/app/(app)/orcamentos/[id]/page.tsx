"use client";

import { use } from "react";
import Link from "next/link";
import { useOrcamento, useUpdateOrcamentoStatus } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Send,
  Copy,
  FileDown,
  ExternalLink,
} from "lucide-react";
import {
  formatCurrency,
  formatDateTime,
} from "@/lib/utils";
import {
  STATUS_ORCAMENTO_LABELS,
  STATUS_ORCAMENTO_COLORS,
  type StatusOrcamento,
} from "@/types";
import { generateOrcamentoHTML, openOrcamentoForPrint } from "@/lib/adapters/pdf";
import { getWhatsAppLink } from "@/lib/adapters/whatsapp";
import { useState, useMemo } from "react";

export default function OrcamentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: orcamento, isLoading } = useOrcamento(id);
  const updateStatus = useUpdateOrcamentoStatus();
  const [copied, setCopied] = useState(false);

  const linkAprovacao = useMemo(() => {
    if (!orcamento) return "";
    return `${typeof window !== "undefined" ? window.location.origin : ""}/aprovar/${orcamento.token_publico}`;
  }, [orcamento]);

  const linkPdf = useMemo(() => {
    if (!orcamento) return "";
    return `${typeof window !== "undefined" ? window.location.origin : ""}/o/${orcamento.token_publico}`;
  }, [orcamento]);

  const isEditable = orcamento
    ? !["aprovado", "entregue", "perdido"].includes(orcamento.status)
    : false;

  function copyLink() {
    navigator.clipboard.writeText(linkAprovacao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEnviarWhatsApp() {
    if (!orcamento?.cliente?.telefone) return;
    const msg = getWhatsAppLink(
      orcamento.cliente.telefone,
      `Olá ${orcamento.cliente.nome}! Siga o orçamento para seu ${orcamento.veiculo?.marca} ${orcamento.veiculo?.modelo}: R$ ${orcamento.valor_total.toFixed(2)}. Acesse para aprovar: ${linkAprovacao}`
    );
    window.open(msg, "_blank");
  }

  function handleExportPDF() {
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

  async function handleSendOrcamento() {
    if (!orcamento) return;
    await updateStatus.mutateAsync({
      id: orcamento.id,
      status: "orcamento_enviado",
    });
  }

  const proximoStatus: Record<string, StatusOrcamento> = {
    contato: "orcamento_enviado",
    orcamento_enviado: "aguardando_aprovacao",
    aguardando_aprovacao: "em_andamento",
    em_andamento: "pronto_retirada",
    pronto_retirada: "entregue",
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!orcamento) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Orçamento não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orcamentos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Orçamento</h1>
            <Badge className={STATUS_ORCAMENTO_COLORS[orcamento.status]}>
              {STATUS_ORCAMENTO_LABELS[orcamento.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Criado em {formatDateTime(orcamento.criado_em)}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orcamento.cliente && (
              <Link
                href={`/clientes/${orcamento.cliente.id}`}
                className="font-medium hover:underline"
              >
                {orcamento.cliente.nome}
              </Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orcamento.veiculo && (
              <Link
                href={`/veiculos/${orcamento.veiculo.id}`}
                className="font-medium hover:underline"
              >
                {orcamento.veiculo.marca} {orcamento.veiculo.modelo} —{" "}
                {orcamento.veiculo.placa}
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left">Descrição</th>
                <th className="pb-2 text-center">Tipo</th>
                <th className="pb-2 text-center">Qtd</th>
                <th className="pb-2 text-right">Valor Unit.</th>
                <th className="pb-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.itens?.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2">{item.descricao}</td>
                  <td className="py-2 text-center">
                    {item.tipo === "peca" ? "Peça" : "Mão de Obra"}
                  </td>
                  <td className="py-2 text-center">{item.quantidade}</td>
                  <td className="py-2 text-right">
                    {formatCurrency(item.valor_unitario)}
                  </td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(item.valor_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Separator className="my-4" />
          <div className="text-right text-xl font-bold">
            Total: {formatCurrency(orcamento.valor_total)}
          </div>
        </CardContent>
      </Card>

      {/* Link de aprovação */}
      <Card>
        <CardHeader>
          <CardTitle>Link de Aprovação</CardTitle>
          <CardDescription>
            Envie este link para o cliente aprovar o orçamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="mr-1 h-3.5 w-3.5" />
              {copied ? "Copiado!" : "Copiar Link"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileDown className="mr-1 h-3.5 w-3.5" />
              Exportar PDF
            </Button>
            {orcamento.cliente?.telefone && (
              <Button variant="outline" size="sm" onClick={handleEnviarWhatsApp}>
                <Send className="mr-1 h-3.5 w-3.5" />
                WhatsApp
              </Button>
            )}
            <a href={linkPdf} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Ver PDF
              </Button>
            </a>
          </div>
          <div className="rounded-md bg-muted p-3 text-sm break-all">
            {linkAprovacao}
          </div>
          {orcamento.enviado_em && (
            <p className="text-xs text-muted-foreground">
              Enviado em: {formatDateTime(orcamento.enviado_em)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      {orcamento.observacoes && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{orcamento.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Ações de status */}
      {isEditable && (
        <div className="flex flex-wrap gap-3">
          {orcamento.status === "contato" && (
            <Button onClick={handleSendOrcamento} disabled={updateStatus.isPending}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Orçamento
            </Button>
          )}
          {proximoStatus[orcamento.status] && (
            <Button
              variant="outline"
              onClick={() =>
                updateStatus.mutateAsync({
                  id: orcamento.id,
                  status: proximoStatus[orcamento.status],
                })
              }
              disabled={updateStatus.isPending}
            >
              Avançar para:{" "}
              {STATUS_ORCAMENTO_LABELS[proximoStatus[orcamento.status]]}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
