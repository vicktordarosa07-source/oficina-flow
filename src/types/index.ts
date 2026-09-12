export type Oficina = {
  id: string;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  endereco: string | null;
  logo_url: string | null;
  criado_em: string;
};

export type Profile = {
  id: string;
  oficina_id: string;
  nome: string;
  email: string;
  role: "owner" | "admin" | "mecanico";
};

export type Cliente = {
  id: string;
  oficina_id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  cpf_cnpj: string | null;
  observacoes: string | null;
  criado_em: string;
};

export type Veiculo = {
  id: string;
  oficina_id: string;
  cliente_id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  km: number | null;
  cor: string | null;
  observacoes: string | null;
  cliente?: Cliente;
};

export type StatusOrcamento =
  | "contato"
  | "orcamento_enviado"
  | "aguardando_aprovacao"
  | "aprovado"
  | "em_andamento"
  | "pronto_retirada"
  | "entregue"
  | "perdido";

export const STATUS_ORCAMENTO_LABELS: Record<StatusOrcamento, string> = {
  contato: "Contato",
  orcamento_enviado: "Enviado",
  aguardando_aprovacao: "Aguardando",
  aprovado: "Aprovado",
  em_andamento: "Em Andamento",
  pronto_retirada: "Pronto",
  entregue: "Entregue",
  perdido: "Perdido",
};

export const STATUS_ORCAMENTO_COLORS: Record<StatusOrcamento, string> = {
  contato: "bg-gray-100 text-gray-700",
  orcamento_enviado: "bg-blue-100 text-blue-700",
  aguardando_aprovacao: "bg-yellow-100 text-yellow-700",
  aprovado: "bg-green-100 text-green-700",
  em_andamento: "bg-orange-100 text-orange-700",
  pronto_retirada: "bg-purple-100 text-purple-700",
  entregue: "bg-emerald-100 text-emerald-700",
  perdido: "bg-red-100 text-red-700",
};

export type TipoItem = "peca" | "mao_de_obra";

export type Orcamento = {
  id: string;
  oficina_id: string;
  cliente_id: string;
  veiculo_id: string;
  status: StatusOrcamento;
  valor_total: number;
  observacoes: string | null;
  token_publico: string;
  criado_em: string;
  enviado_em: string | null;
  aprovado_em: string | null;
  expira_em: string | null;
  cliente?: Cliente;
  veiculo?: Veiculo;
  itens?: OrcamentoItem[];
};

export type OrcamentoItem = {
  id: string;
  orcamento_id: string;
  descricao: string;
  tipo: TipoItem;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
};

export type OrdemServico = {
  id: string;
  oficina_id: string;
  orcamento_id: string;
  veiculo_id: string;
  status: string;
  data_entrada: string;
  data_saida: string | null;
  km_entrada: number | null;
  observacoes: string | null;
  orcamento?: Orcamento;
  veiculo?: Veiculo;
};

export type HistoricoVeiculo = {
  id: string;
  veiculo_id: string;
  tipo: string;
  descricao: string;
  km: number | null;
  data: string;
  valor: number | null;
};

export type FollowUp = {
  id: string;
  orcamento_id: string;
  tipo: string;
  agendado_para: string;
  executado_em: string | null;
  status: "pendente" | "executado" | "cancelado";
  mensagem: string | null;
  orcamento?: Orcamento;
};

export type Tag = {
  id: string;
  oficina_id: string;
  nome: string;
  cor: string;
};

export type Nota = {
  id: string;
  cliente_id: string | null;
  orcamento_id: string | null;
  usuario_id: string;
  conteudo: string;
  criado_em: string;
};

// Dashboard types
export type DashboardMetrics = {
  orcamentosMes: number;
  taxaConversao: number;
  valorNegociacao: number;
  followupsAtrasados: number;
  topServicos: { descricao: string; total: number }[];
};

// Kanban column
export type KanbanColumn = {
  id: StatusOrcamento;
  label: string;
  items: Orcamento[];
};
