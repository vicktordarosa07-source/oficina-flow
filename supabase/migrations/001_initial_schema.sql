-- ============================================
-- OficinaFlow — Schema do Banco de Dados
-- Supabase / Postgres
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'mecanico');

CREATE TYPE orcamento_status AS ENUM (
  'contato',
  'orcamento_enviado',
  'aguardando_aprovacao',
  'aprovado',
  'em_andamento',
  'pronto_retirada',
  'entregue',
  'perdido'
);

CREATE TYPE item_tipo AS ENUM ('peca', 'mao_de_obra');

CREATE TYPE followup_status AS ENUM ('pendente', 'executado', 'cancelado');

-- ============================================
-- TABLES
-- ============================================

-- Oficinas (multi-tenant)
CREATE TABLE oficinas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  endereco TEXT,
  logo_url TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles (usuários vinculados a oficina)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  cpf_cnpj TEXT,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Veículos
CREATE TABLE veiculos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  placa TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER,
  km INTEGER,
  cor TEXT,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(oficina_id, placa)
);

-- Orçamentos
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  status orcamento_status NOT NULL DEFAULT 'contato',
  valor_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  token_publico TEXT NOT NULL UNIQUE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  enviado_em TIMESTAMPTZ,
  aprovado_em TIMESTAMPTZ,
  expira_em TIMESTAMPTZ
);

-- Itens do orçamento
CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  tipo item_tipo NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario NUMERIC(10, 2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- Ordens de Serviço
CREATE TABLE ordens_servico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'aguardando',
  data_entrada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_saida TIMESTAMPTZ,
  km_entrada INTEGER,
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Histórico do veículo
CREATE TABLE historico_veiculo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  veiculo_id UUID NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  km INTEGER,
  data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valor NUMERIC(10, 2)
);

-- Follow-ups
CREATE TABLE followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  agendado_para TIMESTAMPTZ NOT NULL,
  executado_em TIMESTAMPTZ,
  status followup_status NOT NULL DEFAULT 'pendente',
  mensagem TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL DEFAULT '#f97316'
);

-- Cliente Tags (N:N)
CREATE TABLE cliente_tags (
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (cliente_id, tag_id)
);

-- Notas
CREATE TABLE notas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  orcamento_id UUID REFERENCES orcamentos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_clientes_oficina ON clientes(oficina_id);
CREATE INDEX idx_clientes_nome ON clientes(nome);
CREATE INDEX idx_veiculos_oficina ON veiculos(oficina_id);
CREATE INDEX idx_veiculos_cliente ON veiculos(cliente_id);
CREATE INDEX idx_veiculos_placa ON veiculos(oficina_id, placa);
CREATE INDEX idx_orcamentos_oficina ON orcamentos(oficina_id);
CREATE INDEX idx_orcamentos_status ON orcamentos(status);
CREATE INDEX idx_orcamentos_token ON orcamentos(token_publico);
CREATE INDEX idx_orcamentos_cliente ON orcamentos(cliente_id);
CREATE INDEX idx_orcamento_itens_orcamento ON orcamento_itens(orcamento_id);
CREATE INDEX idx_ordens_servico_oficina ON ordens_servico(oficina_id);
CREATE INDEX idx_followups_orcamento ON followups(orcamento_id);
CREATE INDEX idx_followups_status ON followups(status);
CREATE INDEX idx_historico_veiculo ON historico_veiculo(veiculo_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE oficinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_veiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;

-- Helper: get user's oficina_id
CREATE OR REPLACE FUNCTION get_user_oficina_id()
RETURNS UUID AS $$
  SELECT oficina_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: users can see their own profile
CREATE POLICY "users_select_own_profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Oficinas: members can see their own oficina
CREATE POLICY "oficinas_select_own"
  ON oficinas FOR SELECT
  USING (id = get_user_oficina_id());

CREATE POLICY "oficinas_update_owner"
  ON oficinas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.oficina_id = oficinas.id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Clientes: scoped by oficina_id
CREATE POLICY "clientes_select_own"
  ON clientes FOR SELECT
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "clientes_insert_own"
  ON clientes FOR INSERT
  WITH CHECK (oficina_id = get_user_oficina_id());

CREATE POLICY "clientes_update_own"
  ON clientes FOR UPDATE
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "clientes_delete_owner"
  ON clientes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.oficina_id = clientes.oficina_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Veículos: scoped by oficina_id
CREATE POLICY "veiculos_select_own"
  ON veiculos FOR SELECT
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "veiculos_insert_own"
  ON veiculos FOR INSERT
  WITH CHECK (oficina_id = get_user_oficina_id());

CREATE POLICY "veiculos_update_own"
  ON veiculos FOR UPDATE
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "veiculos_delete_owner"
  ON veiculos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.oficina_id = veiculos.oficina_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Orçamentos: scoped by oficina_id
CREATE POLICY "orcamentos_select_own"
  ON orcamentos FOR SELECT
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "orcamentos_insert_own"
  ON orcamentos FOR INSERT
  WITH CHECK (oficina_id = get_user_oficina_id());

CREATE POLICY "orcamentos_update_own"
  ON orcamentos FOR UPDATE
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "orcamentos_delete_owner"
  ON orcamentos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.oficina_id = orcamentos.oficina_id
      AND profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Orçamento Itens: via orcamento → oficina
CREATE POLICY "orcamento_itens_select_own"
  ON orcamento_itens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = orcamento_itens.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "orcamento_itens_insert_own"
  ON orcamento_itens FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = orcamento_itens.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "orcamento_itens_delete_own"
  ON orcamento_itens FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = orcamento_itens.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

-- Ordens de Serviço: scoped by oficina_id
CREATE POLICY "ordens_servico_select_own"
  ON ordens_servico FOR SELECT
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "ordens_servico_insert_own"
  ON ordens_servico FOR INSERT
  WITH CHECK (oficina_id = get_user_oficina_id());

CREATE POLICY "ordens_servico_update_own"
  ON ordens_servico FOR UPDATE
  USING (oficina_id = get_user_oficina_id());

-- Histórico do Veículo: via veiculo → oficina
CREATE POLICY "historico_veiculo_select_own"
  ON historico_veiculo FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM veiculos
      WHERE veiculos.id = historico_veiculo.veiculo_id
      AND veiculos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "historico_veiculo_insert_own"
  ON historico_veiculo FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM veiculos
      WHERE veiculos.id = historico_veiculo.veiculo_id
      AND veiculos.oficina_id = get_user_oficina_id()
    )
  );

-- Follow-ups: via orcamento → oficina
CREATE POLICY "followups_select_own"
  ON followups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = followups.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "followups_insert_own"
  ON followups FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = followups.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "followups_update_own"
  ON followups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = followups.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

-- Tags: scoped by oficina_id
CREATE POLICY "tags_select_own"
  ON tags FOR SELECT
  USING (oficina_id = get_user_oficina_id());

CREATE POLICY "tags_insert_own"
  ON tags FOR INSERT
  WITH CHECK (oficina_id = get_user_oficina_id());

CREATE POLICY "tags_delete_own"
  ON tags FOR DELETE
  USING (oficina_id = get_user_oficina_id());

-- Cliente Tags: via cliente → oficina
CREATE POLICY "cliente_tags_select_own"
  ON cliente_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = cliente_tags.cliente_id
      AND clientes.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "cliente_tags_insert_own"
  ON cliente_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = cliente_tags.cliente_id
      AND clientes.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "cliente_tags_delete_own"
  ON cliente_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = cliente_tags.cliente_id
      AND clientes.oficina_id = get_user_oficina_id()
    )
  );

-- Notas: via cliente/orcamento → oficina
CREATE POLICY "notas_select_own"
  ON notas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = notas.cliente_id
      AND clientes.oficina_id = get_user_oficina_id()
    )
    OR
    EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = notas.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    )
  );

CREATE POLICY "notas_insert_own"
  ON notas FOR INSERT
  WITH CHECK (
    (notas.cliente_id IS NULL OR EXISTS (
      SELECT 1 FROM clientes
      WHERE clientes.id = notas.cliente_id
      AND clientes.oficina_id = get_user_oficina_id()
    ))
    AND
    (notas.orcamento_id IS NULL OR EXISTS (
      SELECT 1 FROM orcamentos
      WHERE orcamentos.id = notas.orcamento_id
      AND orcamentos.oficina_id = get_user_oficina_id()
    ))
  );

-- ============================================
-- PUBLIC ACCESS for approval page
-- ============================================

-- Allow anonymous read on orcamentos by token_publico (for /aprovar/[token])
CREATE POLICY "orcamentos_public_select_by_token"
  ON orcamentos FOR SELECT
  USING (true);  -- Public read for approval link (filtered by token in app)

-- Allow anonymous update on orcamentos by token (for approval action)
CREATE POLICY "orcamentos_public_update_by_token"
  ON orcamentos FOR UPDATE
  USING (true);  -- Public update for approval (filtered by token in app)

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, oficina_id, nome, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'oficina_id', '')::uuid,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
    NEW.email,
    'owner'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
