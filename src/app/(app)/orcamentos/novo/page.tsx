"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClientes, useVeiculos, useCreateOrcamento } from "@/hooks";
import {
  orcamentoSchema,
  type OrcamentoFormValues,
} from "@/lib/validators";
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
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const { data: clientes } = useClientes();
  const [clienteId, setClienteId] = useState<string>("");
  const { data: veiculos } = useVeiculos(clienteId || undefined);
  const createMutation = useCreateOrcamento();

  const form = useForm<OrcamentoFormValues>({
    resolver: zodResolver(orcamentoSchema),
    defaultValues: {
      cliente_id: "",
      veiculo_id: "",
      observacoes: "",
      itens: [{ descricao: "", tipo: "peca", quantidade: 1, valor_unitario: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const itens = form.watch("itens");
  const valorTotal = itens.reduce(
    (acc, item) => acc + (item.quantidade || 0) * (item.valor_unitario || 0),
    0
  );

  async function onSubmit(data: OrcamentoFormValues) {
    const result = await createMutation.mutateAsync({
      orcamento: {
        cliente_id: data.cliente_id,
        veiculo_id: data.veiculo_id,
        observacoes: data.observacoes || undefined,
      },
      itens: data.itens,
    });
    router.push(`/orcamentos/${result.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orcamentos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Novo Orçamento</h1>
          <p className="text-muted-foreground">
            Crie um orçamento para o cliente
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Básicos */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Orçamento</CardTitle>
            <CardDescription>
              Selecione o cliente e veículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select
                value={form.watch("cliente_id") || undefined}
                onValueChange={(val) => {
                  form.setValue("cliente_id", val);
                  form.setValue("veiculo_id", "");
                  setClienteId(val);
                }}
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

            <div className="space-y-2">
              <Label>Veículo *</Label>
              <Select
                value={form.watch("veiculo_id")}
                onValueChange={(val) => form.setValue("veiculo_id", val)}
                disabled={!clienteId}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      clienteId
                        ? "Selecione o veículo"
                        : "Primeiro selecione um cliente"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {veiculos?.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.marca} {v.modelo} — {v.placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.veiculo_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.veiculo_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o orçamento..."
                {...form.register("observacoes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Itens do Orçamento</CardTitle>
              <CardDescription>Adicione peças e mão de obra</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  descricao: "",
                  tipo: "peca",
                  quantidade: 1,
                  valor_unitario: 0,
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Adicionar Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.formState.errors.itens?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.itens.root.message}
              </p>
            )}

            {fields.map((field, index) => {
              const itemValor =
                (itens[index]?.quantidade || 0) *
                (itens[index]?.valor_unitario || 0);

              return (
                <div
                  key={field.id}
                  className="rounded-md border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Item {index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1 lg:col-span-2">
                      <Label>Descrição *</Label>
                      <Input
                        placeholder="Ex: Filtro de óleo"
                        {...form.register(`itens.${index}.descricao`)}
                      />
                      {form.formState.errors.itens?.[index]?.descricao && (
                        <p className="text-xs text-destructive">
                          {form.formState.errors.itens?.[index]?.descricao?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Tipo *</Label>
                      <Select
                        value={form.watch(`itens.${index}.tipo`)}
                        onValueChange={(val) =>
                          form.setValue(
                            `itens.${index}.tipo`,
                            val as "peca" | "mao_de_obra"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peca">Peça</SelectItem>
                          <SelectItem value="mao_de_obra">
                            Mão de Obra
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label>Qtd *</Label>
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`itens.${index}.quantidade`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Valor Unit. *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...form.register(`itens.${index}.valor_unitario`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm font-medium">
                    Subtotal: {formatCurrency(itemValor)}
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="flex items-center justify-end rounded-md bg-primary/5 p-4">
              <span className="text-lg font-bold">
                Total: {formatCurrency(valorTotal)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/orcamentos">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Salvando..." : "Criar Orçamento"}
          </Button>
        </div>
      </form>
    </div>
  );
}
