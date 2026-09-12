"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCliente } from "@/hooks";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoClientePage() {
  const router = useRouter();
  const createMutation = useCreateCliente();

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      cpf_cnpj: "",
      observacoes: "",
    },
  });

  async function onSubmit(data: ClienteFormValues) {
    await createMutation.mutateAsync({
      nome: data.nome,
      telefone: data.telefone || null,
      email: data.email || null,
      cpf_cnpj: data.cpf_cnpj || null,
      observacoes: data.observacoes || null,
    });
    router.push("/clientes");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Cadastre um novo cliente na oficina
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Cliente</CardTitle>
          <CardDescription>
            Preencha as informações do cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Nome do cliente"
                {...form.register("nome")}
              />
              {form.formState.errors.nome && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  {...form.register("telefone")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@email.com"
                  {...form.register("email")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                placeholder="000.000.000-00"
                {...form.register("cpf_cnpj")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Notas sobre o cliente..."
                {...form.register("observacoes")}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/clientes">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
