"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCliente, useUpdateCliente, useVeiculos } from "@/hooks";
import { clienteSchema, type ClienteFormValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Car, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: cliente, isLoading } = useCliente(id);
  const { data: veiculos } = useVeiculos(id);
  const updateMutation = useUpdateCliente();

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    values: cliente
      ? {
          nome: cliente.nome,
          telefone: cliente.telefone || undefined,
          email: cliente.email || undefined,
          cpf_cnpj: cliente.cpf_cnpj || undefined,
          observacoes: cliente.observacoes || undefined,
        }
      : undefined,
  });

  async function onSubmit(data: ClienteFormValues) {
    await updateMutation.mutateAsync({
      id,
      nome: data.nome,
      telefone: data.telefone || null,
      email: data.email || null,
      cpf_cnpj: data.cpf_cnpj || null,
      observacoes: data.observacoes || null,
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cliente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{cliente.nome}</h1>
          <p className="text-muted-foreground">
            Cadastrado em {formatDate(cliente.criado_em)}
          </p>
        </div>
      </div>

      {/* Dados do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
          <CardDescription>Edite as informações do cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" {...form.register("nome")} />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" {...form.register("telefone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...form.register("email")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input id="cpf_cnpj" {...form.register("cpf_cnpj")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" {...form.register("observacoes")} />
            </div>

            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Veículos do Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Veículos
            </CardTitle>
            <CardDescription>
              {veiculos?.length || 0} veículo(s) cadastrado(s)
            </CardDescription>
          </div>
          <Link href={`/veiculos/novo?cliente_id=${id}`}>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Adicionar
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!veiculos || veiculos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum veículo cadastrado para este cliente.
            </p>
          ) : (
            <div className="space-y-2">
              {veiculos.map((v) => (
                <Link
                  key={v.id}
                  href={`/veiculos/${v.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {v.marca} {v.modelo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placa: {v.placa}
                      {v.ano ? ` • ${v.ano}` : ""}
                      {v.km ? ` • ${v.km.toLocaleString("pt-BR")} km` : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
