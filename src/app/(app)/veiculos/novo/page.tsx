"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientes, useCreateVeiculo } from "@/hooks";
import { veiculoSchema, type VeiculoFormValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoVeiculoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clienteIdPrefill = searchParams.get("cliente_id") || "";
  const { data: clientes } = useClientes();
  const createMutation = useCreateVeiculo();

  const form = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoSchema),
    defaultValues: {
      cliente_id: clienteIdPrefill,
      placa: "",
      marca: "",
      modelo: "",
      ano: undefined,
      km: undefined,
      cor: undefined,
      observacoes: undefined,
    },
  });

  async function onSubmit(data: VeiculoFormValues) {
    await createMutation.mutateAsync({
      cliente_id: data.cliente_id,
      placa: data.placa,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano || null,
      km: data.km || null,
      cor: data.cor || null,
      observacoes: data.observacoes || null,
    });
    if (clienteIdPrefill) {
      router.push(`/clientes/${clienteIdPrefill}`);
    } else {
      router.push("/veiculos");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={clienteIdPrefill ? `/clientes/${clienteIdPrefill}` : "/veiculos"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Veículo</h1>
          <p className="text-muted-foreground">
            Cadastre um veículo para um cliente
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Veículo</CardTitle>
          <CardDescription>
            Preencha as informações do veículo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select
                value={form.watch("cliente_id")}
                onValueChange={(val) => form.setValue("cliente_id", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.cliente_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.cliente_id.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa *</Label>
                <Input
                  id="placa"
                  placeholder="ABC-1234"
                  {...form.register("placa")}
                />
                {form.formState.errors.placa && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.placa.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  placeholder="Ex: Toyota"
                  {...form.register("marca")}
                />
                {form.formState.errors.marca && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.marca.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  placeholder="Ex: Corolla"
                  {...form.register("modelo")}
                />
                {form.formState.errors.modelo && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.modelo.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  placeholder="2024"
                  {...form.register("ano")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="km">KM</Label>
                <Input
                  id="km"
                  type="number"
                  placeholder="50000"
                  {...form.register("km")}
                />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  placeholder="Ex: Prata"
                  {...form.register("cor")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Notas sobre o veículo..."
                {...form.register("observacoes")}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href={
                  clienteIdPrefill
                    ? `/clientes/${clienteIdPrefill}`
                    : "/veiculos"
                }
              >
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Salvar Veículo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
