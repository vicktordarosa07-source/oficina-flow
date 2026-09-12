"use client";

import { use } from "react";
import { useOrcamentoByToken, useAprovarOrcamentoPublic } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wrench, Check, X, Clock, Car } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AprovarPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const { data: orcamento, isLoading, error } = useOrcamentoByToken(token);
  const aprovarMutation = useAprovarOrcamentoPublic();
  const [decided, setDecided] = useState(false);
  const [resultado, setResultado] = useState<"aprovado" | "recusado" | null>(
    null
  );

  async function handleAprovar() {
    await aprovarMutation.mutateAsync({ token, aprovado: true });
    setDecided(true);
    setResultado("aprovado");
  }

  async function handleRecusar() {
    await aprovarMutation.mutateAsync({ token, aprovado: false });
    setDecided(true);
    setResultado("recusado");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-muted-foreground">Carregando orçamento...</p>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
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

  if (decided) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-8 space-y-4">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                resultado === "aprovado"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {resultado === "aprovado" ? (
                <Check className="h-8 w-8" />
              ) : (
                <X className="h-8 w-8" />
              )}
            </div>
            <h2 className="text-xl font-bold">
              {resultado === "aprovado"
                ? "Orçamento Aprovado!"
                : "Orçamento Recusado"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {resultado === "aprovado"
                ? "Obrigado! A oficina entrará em contato para dar prosseguimento ao serviço."
                : "Entendemos. Se mudar de ideia, entre em contato com a oficina."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired =
    orcamento.expira_em && new Date(orcamento.expira_em) < new Date();
  const alreadyDecided =
    orcamento.status === "aprovado" || orcamento.status === "perdido";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Wrench className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Orçamento</h1>
          <p className="text-muted-foreground">
            Revise os detalhes e aprove ou recuse
          </p>
        </div>

        {/* Status Badge */}
        {isExpired && (
          <div className="text-center">
            <Badge variant="destructive">
              <Clock className="mr-1 h-3 w-3" />
              Este orçamento expirou
            </Badge>
          </div>
        )}

        {/* Veículo */}
        {orcamento.veiculo && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-4 w-4" />
                Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {orcamento.veiculo.marca} {orcamento.veiculo.modelo}
              </p>
              <p className="text-sm text-muted-foreground">
                Placa: {orcamento.veiculo.placa}
                {orcamento.veiculo.ano ? ` • ${orcamento.veiculo.ano}` : ""}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orcamento.itens?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p>{item.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.tipo === "peca" ? "Peça" : "Mão de Obra"} •{" "}
                    {item.quantidade}x R$ {item.valor_unitario.toFixed(2)}
                  </p>
                </div>
                <p className="font-medium">{formatCurrency(item.valor_total)}</p>
              </div>
            ))}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(orcamento.valor_total)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {orcamento.observacoes && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                {orcamento.observacoes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data e validade */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Orçamento emitido em {formatDate(orcamento.criado_em)}</p>
          {orcamento.expira_em && (
            <p>Válido até {formatDate(orcamento.expira_em)}</p>
          )}
        </div>

        {/* Botões de ação */}
        {alreadyDecided ? (
          <div className="text-center">
            <Badge
              className={
                orcamento.status === "aprovado"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {orcamento.status === "aprovado"
                ? "Orçamento já foi aprovado"
                : "Orçamento foi recusado"}
            </Badge>
          </div>
        ) : isExpired ? (
          <div className="text-center text-sm text-muted-foreground">
            Este orçamento expirou. Entre em contato com a oficina para
            solicitar um novo orçamento.
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRecusar}
              disabled={aprovarMutation.isPending}
            >
              <X className="mr-2 h-4 w-4" />
              Recusar
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleAprovar}
              disabled={aprovarMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          OficinaFlow — Nunca mais perca um orçamento por esquecimento.
        </p>
      </div>
    </div>
  );
}
