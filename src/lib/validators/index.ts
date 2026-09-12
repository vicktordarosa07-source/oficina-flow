import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cpf_cnpj: z.string().optional(),
  observacoes: z.string().optional(),
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

export const veiculoSchema = z.object({
  cliente_id: z.string().min(1, "Selecione um cliente"),
  placa: z.string().min(7, "Placa inválida").max(8),
  marca: z.string().min(1, "Marca é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  ano: z.coerce.number().min(1900).max(2030).optional(),
  km: z.coerce.number().min(0).optional(),
  cor: z.string().optional(),
  observacoes: z.string().optional(),
});

export type VeiculoFormValues = z.infer<typeof veiculoSchema>;

export const orcamentoItemSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  tipo: z.enum(["peca", "mao_de_obra"]),
  quantidade: z.coerce.number().min(1, "Quantidade mínima: 1"),
  valor_unitario: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
});

export type OrcamentoItemFormValues = z.infer<typeof orcamentoItemSchema>;

export const orcamentoSchema = z.object({
  cliente_id: z.string().min(1, "Selecione um cliente"),
  veiculo_id: z.string().min(1, "Selecione um veículo"),
  observacoes: z.string().optional(),
  itens: z.array(orcamentoItemSchema).min(1, "Adicione pelo menos um item"),
});

export type OrcamentoFormValues = z.infer<typeof orcamentoSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
