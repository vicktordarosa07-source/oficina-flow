"use client";

import { useState } from "react";
import Link from "next/link";
import { useClientes, useDeleteCliente } from "@/hooks";
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
import { Plus, Search, Phone, Mail, Trash2, Eye } from "lucide-react";

export default function ClientesPage() {
  const [busca, setBusca] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: clientes, isLoading } = useClientes(busca);
  const deleteMutation = useDeleteCliente();

  async function handleDelete() {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da oficina
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, telefone ou email..."
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
      ) : !clientes || clientes.length === 0 ? (
        <Card>
          <CardContent className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">
              {busca
                ? "Nenhum cliente encontrado."
                : "Nenhum cliente cadastrado. Clique em 'Novo Cliente' para começar."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{cliente.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cliente.telefone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {cliente.telefone}
                  </div>
                )}
                {cliente.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {cliente.email}
                  </div>
                )}
                {cliente.cpf_cnpj && (
                  <p className="text-xs text-muted-foreground">
                    CPF/CNPJ: {cliente.cpf_cnpj}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Link href={`/clientes/${cliente.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Ver
                    </Button>
                  </Link>
                  <Dialog
                    open={deleteId === cliente.id}
                    onOpenChange={(open) => !open && setDeleteId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(cliente.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Excluir cliente?</DialogTitle>
                        <DialogDescription>
                          Esta ação não pode ser desfeita. O cliente{" "}
                          <strong>{cliente.nome}</strong> será removido
                          permanentemente.
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
