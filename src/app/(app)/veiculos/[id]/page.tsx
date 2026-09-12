"use client";

import { use } from "react";
import Link from "next/link";
import { useVeiculo, useHistoricoVeiculo } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Wrench, DollarSign } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function VeiculoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: veiculo, isLoading } = useVeiculo(id);
  const { data: historico } = useHistoricoVeiculo(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!veiculo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Veículo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/veiculos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {veiculo.marca} {veiculo.modelo}
          </h1>
          <p className="text-muted-foreground">
            Placa: <span className="font-medium text-foreground">{veiculo.placa}</span>
          </p>
        </div>
      </div>

      {/* Dados do Veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Marca</p>
              <p className="font-medium">{veiculo.marca}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Modelo</p>
              <p className="font-medium">{veiculo.modelo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ano</p>
              <p className="font-medium">{veiculo.ano || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">KM</p>
              <p className="font-medium">
                {veiculo.km ? veiculo.km.toLocaleString("pt-BR") : "—"}
              </p>
            </div>
            {veiculo.cor && (
              <div>
                <p className="text-xs text-muted-foreground">Cor</p>
                <p className="font-medium">{veiculo.cor}</p>
              </div>
            )}
            {veiculo.cliente && (
              <div>
                <p className="text-xs text-muted-foreground">Cliente</p>
                <Link
                  href={`/clientes/${veiculo.cliente.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {veiculo.cliente.nome}
                </Link>
              </div>
            )}
          </div>
          {veiculo.observacoes && (
            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground mb-1">Observações</p>
              <p className="text-sm">{veiculo.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline de Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico
          </CardTitle>
          <CardDescription>
            Registro de serviços e manutenções
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!historico || historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum registro no histórico deste veículo.
            </p>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              {historico.map((item) => (
                <div key={item.id} className="relative flex gap-4">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {item.tipo === "servico" ? (
                      <Wrench className="h-4 w-4" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.descricao}</p>
                      <Badge variant="secondary">{item.tipo}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(item.data)}</span>
                      {item.km && <span>{item.km.toLocaleString("pt-BR")} km</span>}
                      {item.valor && (
                        <span>{formatCurrency(item.valor)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
