"use client";

import Link from "next/link";
import { useOrcamentos } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  STATUS_ORCAMENTO_LABELS,
  STATUS_ORCAMENTO_COLORS,
  type StatusOrcamento,
} from "@/types";
import { useState } from "react";

export default function OrcamentosPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const { data: orcamentos, isLoading } = useOrcamentos(
    filtroStatus !== "todos" ? (filtroStatus as StatusOrcamento) : undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">
            Gerencie os orçamentos da oficina
          </p>
        </div>
        <Link href="/orcamentos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Object.entries(STATUS_ORCAMENTO_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : !orcamentos || orcamentos.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              Nenhum orçamento encontrado.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orcamentos.map((orc) => (
            <Link key={orc.id} href={`/orcamentos/${orc.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {orc.cliente?.nome || "Cliente"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {orc.veiculo?.marca} {orc.veiculo?.modelo} •{" "}
                        {orc.veiculo?.placa}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <p className="font-bold text-lg">
                        {formatCurrency(orc.valor_total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(orc.criado_em)}
                      </p>
                    </div>
                    <Badge
                      className={STATUS_ORCAMENTO_COLORS[orc.status]}
                    >
                      {STATUS_ORCAMENTO_LABELS[orc.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
