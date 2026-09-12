"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  Cliente,
  Veiculo,
  Orcamento,
  OrcamentoItem,
  OrdemServico,
  FollowUp,
  DashboardMetrics,
  StatusOrcamento,
} from "@/types";
import { generateToken } from "@/lib/utils";

const supabase = createClient();

// ==================== CLIENTES ====================
export function useClientes(busca?: string) {
  return useQuery({
    queryKey: ["clientes", busca],
    queryFn: async () => {
      let query = supabase
        .from("clientes")
        .select("*")
        .order("nome", { ascending: true });

      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,telefone.ilike.%${busca}%,email.ilike.%${busca}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Cliente[];
    },
  });
}

export function useCliente(id: string | null) {
  return useQuery({
    queryKey: ["clientes", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Cliente;
    },
    enabled: !!id,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, "id" | "oficina_id" | "criado_em">) => {
      const { data, error } = await supabase
        .from("clientes")
        .insert(cliente)
        .select()
        .single();
      if (error) throw error;
      return data as Cliente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...cliente
    }: Partial<Cliente> & { id: string }) => {
      const { data, error } = await supabase
        .from("clientes")
        .update(cliente)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Cliente;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["clientes", variables.id] });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clientes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}

// ==================== VEÍCULOS ====================
export function useVeiculos(clienteId?: string) {
  return useQuery({
    queryKey: ["veiculos", clienteId],
    queryFn: async () => {
      let query = supabase
        .from("veiculos")
        .select("*, cliente:clientes(*)")
        .order("placa", { ascending: true });

      if (clienteId) {
        query = query.eq("cliente_id", clienteId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Veiculo[];
    },
  });
}

export function useVeiculo(id: string | null) {
  return useQuery({
    queryKey: ["veiculos", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("veiculos")
        .select("*, cliente:clientes(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Veiculo;
    },
    enabled: !!id,
  });
}

export function useCreateVeiculo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (veiculo: Omit<Veiculo, "id" | "oficina_id" | "cliente">) => {
      const { data, error } = await supabase
        .from("veiculos")
        .insert(veiculo)
        .select()
        .single();
      if (error) throw error;
      return data as Veiculo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veiculos"] });
    },
  });
}

export function useUpdateVeiculo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...veiculo
    }: Partial<Veiculo> & { id: string }) => {
      const { data, error } = await supabase
        .from("veiculos")
        .update(veiculo)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Veiculo;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["veiculos"] });
      queryClient.invalidateQueries({ queryKey: ["veiculos", variables.id] });
    },
  });
}

export function useDeleteVeiculo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("veiculos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["veiculos"] });
    },
  });
}

// ==================== ORÇAMENTOS ====================
export function useOrcamentos(status?: StatusOrcamento) {
  return useQuery({
    queryKey: ["orcamentos", status],
    queryFn: async () => {
      let query = supabase
        .from("orcamentos")
        .select("*, cliente:clientes(*), veiculo:veiculos(*), itens:orcamento_itens(*)")
        .order("criado_em", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Orcamento[];
    },
  });
}

export function useOrcamento(id: string | null) {
  return useQuery({
    queryKey: ["orcamentos", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*, cliente:clientes(*), veiculo:veiculos(*), itens:orcamento_itens(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Orcamento;
    },
    enabled: !!id,
  });
}

export function useOrcamentoByToken(token: string | null) {
  return useQuery({
    queryKey: ["orcamentos", "token", token],
    queryFn: async () => {
      if (!token) return null;
      const { data, error } = await supabase
        .from("orcamentos")
        .select("*, cliente:clientes(*), veiculo:veiculos(*), itens:orcamento_itens(*)")
        .eq("token_publico", token)
        .single();
      if (error) throw error;
      return data as Orcamento;
    },
    enabled: !!token,
  });
}

export function useCreateOrcamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      orcamento: {
        cliente_id: string;
        veiculo_id: string;
        observacoes?: string;
      };
      itens: Omit<OrcamentoItem, "id" | "orcamento_id" | "valor_total">[];
    }) => {
      // Calculate valor_total
      const itensComTotal = payload.itens.map((item) => ({
        ...item,
        valor_total: item.quantidade * item.valor_unitario,
      }));

      const valorTotal = itensComTotal.reduce(
        (acc, item) => acc + item.valor_total,
        0
      );

      const token = generateToken();
      const expiraEm = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString();

      // Create orcamento
      const { data: orcamento, error: orcamentoError } = await supabase
        .from("orcamentos")
        .insert({
          ...payload.orcamento,
          status: "contato",
          valor_total: valorTotal,
          token_publico: token,
          expira_em: expiraEm,
        })
        .select()
        .single();

      if (orcamentoError) throw orcamentoError;

      // Create items
      const itensPayload = itensComTotal.map((item) => ({
        ...item,
        orcamento_id: orcamento.id,
      }));

      const { error: itensError } = await supabase
        .from("orcamento_itens")
        .insert(itensPayload);

      if (itensError) throw itensError;

      return orcamento as Orcamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    },
  });
}

export function useUpdateOrcamentoStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: StatusOrcamento;
    }) => {
      const updateData: Record<string, unknown> = { status };

      if (status === "orcamento_enviado") {
        updateData.enviado_em = new Date().toISOString();
      } else if (status === "aprovado") {
        updateData.aprovado_em = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("orcamentos")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Se aprovado → criar ordem de serviço automaticamente
      if (status === "aprovado") {
        const { error: osError } = await supabase
          .from("ordens_servico")
          .insert({
            oficina_id: data.oficina_id,
            orcamento_id: data.id,
            veiculo_id: data.veiculo_id,
            status: "aguardando",
            data_entrada: new Date().toISOString(),
            km_entrada: 0,
          });

        if (osError) throw osError;
      }

      return data as Orcamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAprovarOrcamentoPublic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      token,
      aprovado,
    }: {
      token: string;
      aprovado: boolean;
    }) => {
      const status: StatusOrcamento = aprovado ? "aprovado" : "perdido";

      const { data: orcamento, error } = await supabase
        .from("orcamentos")
        .update({
          status,
          ...(aprovado ? { aprovado_em: new Date().toISOString() } : {}),
        })
        .eq("token_publico", token)
        .select()
        .single();

      if (error) throw error;

      if (aprovado) {
        const { error: osError } = await supabase
          .from("ordens_servico")
          .insert({
            oficina_id: orcamento.oficina_id,
            orcamento_id: orcamento.id,
            veiculo_id: orcamento.veiculo_id,
            status: "aguardando",
            data_entrada: new Date().toISOString(),
            km_entrada: 0,
          });

        if (osError) throw osError;
      }

      return orcamento as Orcamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
    },
  });
}

// ==================== FOLLOW-UPS ====================
export function useFollowups(status?: string) {
  return useQuery({
    queryKey: ["followups", status],
    queryFn: async () => {
      let query = supabase
        .from("followups")
        .select("*, orcamento:orcamentos(*, cliente:clientes(*), veiculo:veiculos(*))")
        .order("agendado_para", { ascending: true });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FollowUp[];
    },
  });
}

export function useExecutarFollowup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("followups")
        .update({
          status: "executado",
          executado_em: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followups"] });
    },
  });
}

// ==================== DASHBOARD ====================
export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const now = new Date();
      const primeiroDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);

      // Orçamentos do mês
      const { count: orcamentosMes } = await supabase
        .from("orcamentos")
        .select("*", { count: "exact", head: true })
        .gte("criado_em", primeiroDiaMes.toISOString());

      // Aprovados no mês
      const { count: aprovadosMes } = await supabase
        .from("orcamentos")
        .select("*", { count: "exact", head: true })
        .gte("criado_em", primeiroDiaMes.toISOString())
        .eq("status", "aprovado");

      // Valor total em negociação (enviados + aguardando)
      const { data: negociacao } = await supabase
        .from("orcamentos")
        .select("valor_total")
        .in("status", ["orcamento_enviado", "aguardando_aprovacao"]);

      const valorNegociacao =
        negociacao?.reduce((acc, o) => acc + (o.valor_total || 0), 0) || 0;

      // Follow-ups atrasados
      const { count: followupsAtrasados } = await supabase
        .from("followups")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente")
        .lt("agendado_para", now.toISOString());

      // Top serviços
      const { data: topServicos } = await supabase
        .from("orcamento_itens")
        .select("descricao, valor_total")
        .eq("tipo", "peca")
        .order("valor_total", { ascending: false })
        .limit(5);

      const metrics: DashboardMetrics = {
        orcamentosMes: orcamentosMes || 0,
        taxaConversao:
          (orcamentosMes || 0) > 0
            ? Math.round(((aprovadosMes || 0) / (orcamentosMes || 1)) * 100)
            : 0,
        valorNegociacao,
        followupsAtrasados: followupsAtrasados || 0,
        topServicos:
          topServicos?.map((s) => ({
            descricao: s.descricao,
            total: s.valor_total || 0,
          })) || [],
      };

      return metrics;
    },
  });
}

// ==================== HISTÓRICO VEÍCULO ====================
export function useHistoricoVeiculo(veiculoId: string | null) {
  return useQuery({
    queryKey: ["historico_veiculo", veiculoId],
    queryFn: async () => {
      if (!veiculoId) return [];
      const { data, error } = await supabase
        .from("historico_veiculo")
        .select("*")
        .eq("veiculo_id", veiculoId)
        .order("data", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!veiculoId,
  });
}
