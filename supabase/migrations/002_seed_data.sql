-- ============================================
-- OficinaFlow — Seed de Dados de Exemplo
-- Execute APÓS o schema (001_initial_schema.sql)
-- ============================================

-- ============================================
-- 1. Criar oficina de exemplo
-- ============================================

INSERT INTO oficinas (id, nome, cnpj, telefone, endereco)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Auto Mecânica São Paulo',
  '12.345.678/0001-99',
  '(11) 3456-7890',
  'Rua das Flores, 1234 — São Paulo, SP'
);

-- ============================================
-- 2. Criar usuário de exemplo (via auth)
-- ============================================

-- IMPORTANTE: Crie o usuário via Supabase Auth primeiro.
-- Depois execute este INSERT substituindo o UUID pelo ID do usuário criado.

-- Exemplo (substitua pelo ID real do usuário):
-- INSERT INTO profiles (id, oficina_id, nome, email, role)
-- VALUES (
--   'INSIRA_O_ID_DO_USUARIO_AQUI',
--   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
--   'João Mecânico',
--   'joao@automecanicasp.com.br',
--   'owner'
-- );

-- ============================================
-- 3. Clientes de exemplo
-- ============================================

INSERT INTO clientes (id, oficina_id, nome, telefone, email, cpf_cnpj)
VALUES
  ('c1000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Maria Silva', '(11) 99876-5432', 'maria.silva@email.com', '123.456.789-00'),
  ('c1000001-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Pedro Santos', '(11) 98765-4321', 'pedro.santos@email.com', '987.654.321-00'),
  ('c1000001-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Ana Oliveira', '(11) 97654-3210', 'ana.oliveira@email.com', '456.789.123-00'),
  ('c1000001-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Carlos Ferreira', NULL, NULL, '321.654.987-00'),
  ('c1000001-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'Lucia Souza', '(11) 96543-2109', 'lucia.souza@email.com', NULL);

-- ============================================
-- 4. Veículos de exemplo
-- ============================================

INSERT INTO veiculos (id, oficina_id, cliente_id, placa, marca, modelo, ano, km, cor)
VALUES
  -- Maria Silva (2 veículos)
  ('v1000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000001', 'ABC-1D23', 'Toyota', 'Corolla', 2020, 45000, 'Prata'),
  ('v1000001-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000001', 'DEF-2E34', 'Honda', 'Civic', 2022, 12000, 'Preto'),
  -- Pedro Santos
  ('v1000001-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000002', 'GHI-3F45', 'Volkswagen', 'Gol', 2018, 78000, 'Branco'),
  -- Ana Oliveira (2 veículos)
  ('v1000001-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000003', 'JKL-4G56', 'Chevrolet', 'Onix', 2021, 35000, 'Vermelho'),
  ('v1000001-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000003', 'MNO-5H67', 'Hyundai', 'HB20', 2019, 52000, 'Cinza'),
  -- Carlos Ferreira (2 veículos)
  ('v1000001-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000004', 'PQR-6I78', 'Fiat', 'Argo', 2023, 8000, 'Azul'),
  ('v1000001-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000004', 'STU-7J89', 'Jeep', 'Renegade', 2021, 41000, 'Verde'),
  -- Lucia Souza
  ('v1000001-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000005', 'VWX-8K90', 'Nissan', 'March', 2017, 95000, 'Amarelo');

-- ============================================
-- 5. Orçamentos de exemplo (vários status)
-- ============================================

INSERT INTO orcamentos (id, oficina_id, cliente_id, veiculo_id, status, valor_total, observacoes, token_publico, criado_em, enviado_em, aprovado_em, expira_em)
VALUES
  -- Aprovados (já viraram OS)
  ('o1000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001',
   'aprovado', 1850.00, 'Troca de óleo + filtro + pastilhas de freio',
   'tok_aprovado1_abc123', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days',
   NOW() + INTERVAL '5 days'),

  ('o1000001-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000002', 'v1000001-0000-0000-0000-000000000003',
   'aprovado', 3200.00, 'Revisão completa do motor',
   'tok_aprovado2_def456', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days',
   NOW() + INTERVAL '2 days'),

  -- Em andamento
  ('o1000001-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000004',
   'em_andamento', 980.50, 'Alinhamento e balanceamento',
   'tok_andamento3_ghi789', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day',
   NOW() + INTERVAL '4 days'),

  -- Aguardando aprovação
  ('o1000001-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000004', 'v1000001-0000-0000-0000-000000000006',
   'aguardando_aprovacao', 4500.00, 'Troca de pneus — 4 unidades',
   'tok_aguardando4_jkl012', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL,
   NOW() + INTERVAL '6 days'),

  -- Enviado (há 2 dias — precisa de follow-up 24h)
  ('o1000001-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000002',
   'orcamento_enviado', 2100.00, 'Revisão de suspensão',
   'tok_enviado5_mno345', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL,
   NOW() + INTERVAL '5 days'),

  -- Contato (novo)
  ('o1000001-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000005', 'v1000001-0000-0000-0000-000000000008',
   'contato', 750.00, NULL,
   'tok_contato6_pqr678', NOW() - INTERVAL '5 days', NULL, NULL,
   NOW() + INTERVAL '2 days'),

  -- Perdido
  ('o1000001-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000005',
   'perdido', 1500.00, 'Cliente achou caro',
   'tok_perdido7_stu901', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', NULL,
   NOW() - INTERVAL '8 days'),

  -- Pronto para retirada
  ('o1000001-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000004', 'v1000001-0000-0000-0000-000000000007',
   'pronto_retirada', 2800.00, 'Troca de embreagem completa',
   'tok_pronto8_vwx234', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days',
   NOW() + INTERVAL '3 days'),

  -- Entregue
  ('o1000001-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001',
   'entregue', 1200.00, 'Troca de bateria',
   'tok_entregue9_yza567', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days',
   NOW() - INTERVAL '13 days'),

  -- Enviado há 8 dias (precisa follow-up 7d / marcar perdido)
  ('o1000001-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'c1000001-0000-0000-0000-000000000002', 'v1000001-0000-0000-0000-000000000003',
   'orcamento_enviado', 890.00, 'Troca de velas e cabos de vela',
   'tok_enviado10_bcd890', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NULL,
   NOW() - INTERVAL '1 day');

-- ============================================
-- 6. Itens dos orçamentos
-- ============================================

INSERT INTO orcamento_itens (orcamento_id, descricao, tipo, quantidade, valor_unitario, valor_total)
VALUES
  -- Orçamento 1 (aprovado)
  ('o1000001-0000-0000-0000-000000000001', 'Óleo 5W30 sintético 4L', 'peca', 1, 180.00, 180.00),
  ('o1000001-0000-0000-0000-000000000001', 'Filtro de óleo universal', 'peca', 1, 45.00, 45.00),
  ('o1000001-0000-0000-0000-000000000001', 'Pastilha de freio dianteira (par)', 'peca', 1, 320.00, 320.00),
  ('o1000001-0000-0000-0000-000000000001', 'Mão de obra — troca de óleo', 'mao_de_obra', 1, 80.00, 80.00),
  ('o1000001-0000-0000-0000-000000000001', 'Mão de obra — troca de pastilhas', 'mao_de_obra', 1, 225.00, 225.00),

  -- Orçamento 2 (aprovado)
  ('o1000001-0000-0000-0000-000000000002', 'Kit correia dentada', 'peca', 1, 450.00, 450.00),
  ('o1000001-0000-0000-0000-000000000002', 'Tensor automático', 'peca', 1, 280.00, 280.00),
  ('o1000001-0000-0000-0000-000000000002', 'Rolamento guia', 'peca', 1, 150.00, 150.00),
  ('o1000001-0000-0000-0000-000000000002', 'Mão de obra — revisão motor completa', 'mao_de_obra', 8, 225.00, 1800.00),
  ('o1000001-0000-0000-0000-000000000002', 'Líquido de arrefecimento 4L', 'peca', 1, 120.00, 120.00),

  -- Orçamento 3 (em andamento)
  ('o1000001-0000-0000-0000-000000000003', 'Alinhamento computadorizado', 'mao_de_obra', 1, 180.00, 180.00),
  ('o1000001-0000-0000-0000-000000000003', 'Balanceamento 4 rodas', 'mao_de_obra', 1, 160.00, 160.00),
  ('o1000001-0000-0000-0000-000000000003', 'Peso chumbo (por roda)', 'peca', 8, 5.00, 40.00),
  ('o1000001-0000-0000-0000-000000000003', 'Mão de obra — roda sobressalente', 'mao_de_obra', 1, 600.50, 600.50),

  -- Orçamento 4 (aguardando aprovação)
  ('o1000001-0000-0000-0000-000000000004', 'Pneu aro 15 195/65 R15', 'peca', 4, 420.00, 1680.00),
  ('o1000001-0000-0000-0000-000000000004', ' válvula de ar', 'peca', 4, 15.00, 60.00),
  ('o1000001-0000-0000-0000-000000000004', 'Mão de obra — montagem e balanceamento', 'mao_de_obra', 1, 200.00, 200.00),
  ('o1000001-0000-0000-0000-000000000004', 'Alinhamento after install', 'mao_de_obra', 1, 180.00, 180.00),
  ('o1000001-0000-0000-0000-000000000004', 'Descarte de pneus velhos', 'mao_de_obra', 4, 25.00, 100.00),

  -- Orçamento 5 (enviado — precisa follow-up)
  ('o1000001-0000-0000-0000-000000000005', 'Amortecedor dianteiro (par)', 'peca', 1, 680.00, 680.00),
  ('o1000001-0000-0000-0000-000000000005', 'Bucha de suspensão', 'peca', 4, 45.00, 180.00),
  ('o1000001-0000-0000-0000-000000000005', 'Mão de obra — suspensão dianteira', 'mao_de_obra', 4, 185.00, 740.00),

  -- Orçamento 6 (contato)
  ('o1000001-0000-0000-0000-000000000006', 'Lâmpada farol H7', 'peca', 2, 45.00, 90.00),
  ('o1000001-0000-0000-0000-000000000006', 'Mão de obra — troca de lâmpadas', 'mao_de_obra', 1, 60.00, 60.00),
  ('o1000001-0000-0000-0000-000000000006', 'Limpeza de contatos elétricos', 'mao_de_obra', 1, 100.00, 100.00),
  ('o1000001-0000-0000-0000-000000000006', 'Verificação de fiação geral', 'mao_de_obra', 1, 200.00, 200.00),
  ('o1000001-0000-0000-0000-000000000006', 'Religação de borne da bateria', 'mao_de_obra', 1, 80.00, 80.00),
  ('o1000001-0000-0000-0000-000000000006', 'Troca de fusível quadro', 'peca', 3, 15.00, 45.00),
  ('o1000001-0000-0000-0000-000000000006', 'Teste de voltagem alternador', 'mao_de_obra', 1, 75.00, 75.00),
  ('o1000001-0000-0000-0000-000000000006', 'Servo freio — verificação', 'mao_de_obra', 1, 100.00, 100.00),

  -- Orçamento 7 (perdido)
  ('o1000001-0000-0000-0000-000000000007', 'Kit embreagem completo', 'peca', 1, 950.00, 950.00),
  ('o1000001-0000-0000-0000-000000000007', 'Mão de obra — troca de embreagem', 'mao_de_obra', 6, 91.67, 550.00),

  -- Orçamento 8 (pronto para retirada)
  ('o1000001-0000-0000-0000-000000000008', 'Kit embreagem completo', 'peca', 1, 1100.00, 1100.00),
  ('o1000001-0000-0000-0000-000000000008', 'Rolamento piloto', 'peca', 1, 280.00, 280.00),
  ('o1000001-0000-0000-0000-000000000008', 'Líquido transmissão', 'peca', 2, 85.00, 170.00),
  ('o1000001-0000-0000-0000-000000000008', 'Mão de obra — troca de embreagem', 'mao_de_obra', 6, 200.00, 1200.00),
  ('o1000001-0000-0000-0000-000000000008', 'Alinhamento pós-serviço', 'mao_de_obra', 1, 50.00, 50.00),

  -- Orçamento 9 (entregue)
  ('o1000001-0000-0000-0000-000000000009', 'Bateria 60Ah', 'peca', 1, 380.00, 380.00),
  ('o1000001-0000-0000-0000-000000000009', 'Terminal de bateria (+)', 'peca', 1, 35.00, 35.00),
  ('o1000001-0000-0000-0000-000000000009', 'Terminal de bateria (-)', 'peca', 1, 35.00, 35.00),
  ('o1000001-0000-0000-0000-000000000009', 'Mão de obra — troca de bateria', 'mao_de_obra', 1, 120.00, 120.00),
  ('o1000001-0000-0000-0000-000000000009', 'Teste de sistema elétrico', 'mao_de_obra', 1, 130.00, 130.00),
  ('o1000001-0000-0000-0000-000000000009', 'Limpeza de bornes', 'mao_de_obra', 1, 45.00, 45.00),
  ('o1000001-0000-0000-0000-000000000009', 'Subtotal peças', 'peca', 1, 255.00, 255.00),
  ('o1000001-0000-0000-0000-000000000009', 'Mão de obra geral', 'mao_de_obra', 1, 200.00, 200.00),

  -- Orçamento 10 (enviado há 8 dias — precisa follow-up 7d)
  ('o1000001-0000-0000-0000-000000000010', 'Velas de ignição Iridium', 'peca', 4, 65.00, 260.00),
  ('o1000001-0000-0000-0000-000000000010', 'Cabo de vela (conjunto)', 'peca', 1, 180.00, 180.00),
  ('o1000001-0000-0000-0000-000000000010', 'Mão de obra — troca velas e cabos', 'mao_de_obra', 2, 125.00, 250.00),
  ('o1000001-0000-0000-0000-000000000010', 'Diagnóstico eletrônico OBD2', 'mao_de_obra', 1, 100.00, 100.00),
  ('o1000001-0000-0000-0000-000000000010', 'Limpeza de body', 'mao_de_obra', 1, 100.00, 100.00);

-- ============================================
-- 7. Ordens de serviço para orçamentos aprovados
-- ============================================

INSERT INTO ordens_servico (oficina_id, orcamento_id, veiculo_id, status, data_entrada, km_entrada, observacoes)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'o1000001-0000-0000-0000-000000000001', 'v1000001-0000-0000-0000-000000000001',
   'concluido', NOW() - INTERVAL '7 days', 45000, 'Serviço concluído com sucesso'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'o1000001-0000-0000-0000-000000000002', 'v1000001-0000-0000-0000-000000000003',
   'em_andamento', NOW() - INTERVAL '4 days', 78000, 'Motor em revisão'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'o1000001-0000-0000-0000-000000000003', 'v1000001-0000-0000-0000-000000000004',
   'em_andamento', NOW() - INTERVAL '2 days', 35000, 'Aguardando peças'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'o1000001-0000-0000-0000-000000000008', 'v1000001-0000-0000-0000-000000000007',
   'pronto', NOW() - INTERVAL '3 days', 41000, 'Pronto para retirada — cliente notificado');

-- ============================================
-- 8. Follow-ups de exemplo
-- ============================================

INSERT INTO followups (orcamento_id, tipo, agendado_para, status, mensagem)
VALUES
  -- Follow-up do orçamento 5 (enviado há 2 dias)
  ('o1000001-0000-0000-0000-000000000005', 'followup_24h',
   NOW() - INTERVAL '1 day', 'pendente',
   'Ligar para Maria sobre orçamento de suspensão (R$ 2.100,00)'),
  ('o1000001-0000-0000-0000-000000000005', 'followup_48h',
   NOW() + INTERVAL '1 day', 'pendente',
   'Segundo contato — Maria sobre suspensão'),

  -- Follow-up do orçamento 6 (contato há 5 dias)
  ('o1000001-0000-0000-0000-000000000006', 'followup_7d',
   NOW() + INTERVAL '2 days', 'pendente',
   'Verificar se Lucia respondeu sobre orçamento elétrico'),

  -- Follow-up do orçamento 10 (enviado há 8 dias — URGENTE)
  ('o1000001-0000-0000-0000-000000000010', 'followup_7d',
   NOW() - INTERVAL '1 day', 'pendente',
   'URGENTE: Marcar orçamento 10 como PERDIDO — Pedro não respondeu em 7 dias'),

  -- Follow-up já executado
  ('o1000001-0000-0000-0000-000000000004', 'followup_24h',
   NOW() - INTERVAL '12 hours', 'executado',
   'Ligar para Carlos sobre pneus (R$ 4.500,00)'),
  ('o1000001-0000-0000-0000-000000000004', 'followup_48h',
   NOW() + INTERVAL '12 hours', 'pendente',
   'Segundo contato — Carlos sobre pneus');

-- ============================================
-- 9. Histórico de veículos
-- ============================================

INSERT INTO historico_veiculo (veiculo_id, tipo, descricao, km, data, valor)
VALUES
  -- Toyota Corolla da Maria
  ('v1000001-0000-0000-0000-000000000001', 'servico', 'Troca de óleo e filtro', 40000, NOW() - INTERVAL '60 days', 260.00),
  ('v1000001-0000-0000-0000-000000000001', 'servico', 'Alinhamento e balanceamento', 38500, NOW() - INTERVAL '90 days', 340.00),
  ('v1000001-0000-0000-0000-000000000001', 'revisao', 'Revisão 40.000 km', 40000, NOW() - INTERVAL '60 days', 1200.00),

  -- Honda Civic da Maria
  ('v1000001-0000-0000-0000-000000000002', 'servico', 'Troca de pneus', 10000, NOW() - INTERVAL '120 days', 2800.00),

  -- VW Gol do Pedro
  ('v1000001-0000-0000-0000-000000000003', 'servico', 'Troca de bateria', 75000, NOW() - INTERVAL '45 days', 380.00),
  ('v1000001-0000-0000-0000-000000000003', 'revisao', 'Revisão 75.000 km', 75000, NOW() - INTERVAL '45 days', 890.00),

  -- Chevrolet Onix da Ana
  ('v1000001-0000-0000-0000-000000000004', 'servico', 'Troca de óleo', 30000, NOW() - INTERVAL '30 days', 220.00),

  -- Fiat Argo do Carlos
  ('v1000001-0000-0000-0000-000000000006', 'servico', 'Primeira revisão 5.000 km', 5000, NOW() - INTERVAL '20 days', 0.00);

-- ============================================
-- 10. Tags de exemplo
-- ============================================

INSERT INTO tags (oficina_id, nome, cor)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VIP', '#f59e0b'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Recorrente', '#10b981'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Novo', '#3b82f6'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Inadimplente', '#ef4444');

-- Vincular tags
INSERT INTO cliente_tags (cliente_id, tag_id)
SELECT 'c1000001-0000-0000-0000-000000000001', id FROM tags WHERE nome = 'VIP' AND oficina_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'c1000001-0000-0000-0000-000000000001', id FROM tags WHERE nome = 'Recorrente' AND oficina_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
UNION ALL
SELECT 'c1000001-0000-0000-0000-000000000004', id FROM tags WHERE nome = 'Novo' AND oficina_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- ============================================
-- FIM DO SEED
-- ============================================
