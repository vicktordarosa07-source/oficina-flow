"use client";

import { useFollowups, useExecutarFollowup } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Clock, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";

export default function FollowupsPage() {
  const { data: pendentes, isLoading: loadingPendentes } =
    useFollowups("pendente");
  const { data: executados, isLoading: loadingExecutados } =
    useFollowups("executado");
  const executarMutation = useExecutarFollowup();

  async function handleExecutar(id: string) {
    await executarMutation.mutateAsync(id);
  }

  function renderFollowup(item: {
    id: string;
    tipo: string;
    agendado_para: string;
    mensagem: string | null;
    status: string;
    orcamento?: {
      id: string;
      cliente?: { nome: string } | null;
      veiculo?: { marca: string; modelo: string; placa: string } | null;
    };
  }) {
    const isAtrasado =
      item.status === "pendente" &&
      new Date(item.agendado_para) < new Date();

    return (
      <div
        key={item.id}
        className="flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
              isAtrasado
                ? "bg-red-100 text-red-600"
                : "bg-primary/10 text-primary"
            }`}
          >
            {isAtrasado ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {item.tipo.replace(/_/g, " ").replace(/\b\w/g, (l) =>
                l.toUpperCase()
              )}
            </p>
            {item.orcamento && (
              <p className="text-sm text-muted-foreground">
                {item.orcamento.cliente?.nome || "Cliente"} •{" "}
                {item.orcamento.veiculo?.marca}{" "}
                {item.orcamento.veiculo?.modelo}
              </p>
            )}
            {item.mensagem && (
              <p className="mt-1 text-xs text-muted-foreground">
                {item.mensagem}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Agendado: {formatDateTime(item.agendado_para)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-11 sm:ml-0">
          {item.orcamento && (
            <Link href={`/orcamentos/${item.orcamento.id}`}>
              <Button variant="outline" size="sm">
                Ver Orçamento
              </Button>
            </Link>
          )}
          {item.status === "pendente" && (
            <Button
              size="sm"
              onClick={() => handleExecutar(item.id)}
              disabled={executarMutation.isPending}
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Concluir
            </Button>
          )}
          {item.status === "executado" && (
            <Badge variant="secondary">Concluído</Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Follow-ups</h1>
        <p className="text-muted-foreground">
          Acompanhe os lembretes e tarefas pendentes
        </p>
      </div>

      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes
            {pendentes && pendentes.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {pendentes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="executados" className="gap-2">
            <Check className="h-4 w-4" />
            Concluídos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-3">
          {loadingPendentes ? (
            <p className="text-muted-foreground py-8 text-center">
              Carregando...
            </p>
          ) : !pendentes || pendentes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum follow-up pendente. Tudo em dia!
                </p>
              </CardContent>
            </Card>
          ) : (
            pendentes.map(renderFollowup)
          )}
        </TabsContent>

        <TabsContent value="executados" className="space-y-3">
          {loadingExecutados ? (
            <p className="text-muted-foreground py-8 text-center">
              Carregando...
            </p>
          ) : !executados || executados.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum follow-up concluído ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            executados.map(renderFollowup)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
