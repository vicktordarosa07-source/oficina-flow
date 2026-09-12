"use client";

import { useState } from "react";
import Link from "next/link";
import { useVeiculos, useDeleteVeiculo } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Eye } from "lucide-react";

export default function VeiculosPage() {
  const [busca, setBusca] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: veiculos, isLoading } = useVeiculos();
  const deleteMutation = useDeleteVeiculo();

  async function handleDelete() {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  }

  const filteredVeiculos = veiculos?.filter(
    (v) =>
      !busca ||
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.marca.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">
            Consulte e gerencie veículos
          </p>
        </div>
        <Link href="/veiculos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Veículo
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por placa, marca, modelo ou cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : !filteredVeiculos || filteredVeiculos.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              {busca
                ? "Nenhum veículo encontrado."
                : "Nenhum veículo cadastrado."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVeiculos.map((veiculo) => (
            <Card key={veiculo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {veiculo.marca} {veiculo.modelo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-primary">
                  {veiculo.placa}
                </p>
                {veiculo.ano && (
                  <p className="text-sm text-muted-foreground">
                    Ano: {veiculo.ano}
                  </p>
                )}
                {veiculo.km && (
                  <p className="text-sm text-muted-foreground">
                    KM: {veiculo.km.toLocaleString("pt-BR")}
                  </p>
                )}
                {veiculo.cliente && (
                  <p className="text-sm text-muted-foreground">
                    Cliente: {veiculo.cliente.nome}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Link href={`/veiculos/${veiculo.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Ver
                    </Button>
                  </Link>
                  <Dialog
                    open={deleteId === veiculo.id}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(veiculo.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Excluir veículo?</DialogTitle>
                        <DialogDescription>
                          {veiculo.marca} {veiculo.modelo} ({veiculo.placa})
                          será removido permanentemente.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteId(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDelete}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending
                            ? "Excluindo..."
                            : "Excluir"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
