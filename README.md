# OficinaFlow 🚗

CRM + organizador de leads e orçamentos para oficinas mecânicas.

**"Nunca mais perca um orçamento por esquecimento."**

---

## Funcionalidades do MVP

1. ✅ Cadastro de clientes e veículos (placa, marca, modelo, ano, km)
2. ✅ Orçamentos com itens (peças + mão de obra), cálculo automático
3. ✅ Link público de aprovação (sem login) — `/aprovar/[token]`
4. ✅ Kanban adaptado à oficina com drag-and-drop
5. ✅ Follow-ups automáticos (24h, 48h, 7 dias, revisões)
6. ✅ Dashboard com métricas de conversão
7. ✅ Histórico do veículo com timeline
8. ✅ Exportação de orçamento em PDF
9. ✅ Botão "Enviar no WhatsApp" (mockado)
10. ✅ Multi-tenant por oficina (RLS no Supabase)
11. ✅ Layout mobile-first responsivo

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth + Postgres + RLS)
- **State:** TanStack Query
- **Forms:** React Hook Form + Zod
- **DnD:** @dnd-kit
- **PDF:** react-pdf + print dialog

---

## Como Rodar

### 1. Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### 2. Configurar Supabase

1. Crie um novo projeto no Supabase
2. Vá em **SQL Editor** e execute o conteúdo de:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
3. Vá em **Authentication > Providers** e habilite **Email**
4. Copie a **URL** e **Anon Key** do projeto

### 3. Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 4. Instalar e Rodar

```bash
# Instalar dependências
yarn install

# Rodar em desenvolvimento
yarn dev
```

Acesse: http://localhost:3000

### 5. Criar Usuário

1. Acesse o Supabase Dashboard > **Authentication > Users**
2. Clique em **Add User** e crie uma conta (email + senha)
3. O profile será criado automaticamente pelo trigger
4. Faça login no app

### 6. Seed de Dados

O seed (`002_seed_data.sql`) cria:
- 1 oficina
- 5 clientes
- 8 veículos
- 10 orçamentos (em vários status)
- Ordens de serviço
- Follow-ups
- Histórico de veículos
- Tags

**Nota:** Você precisa substituir o UUID do usuário no seed pelo ID real do seu usuário criado no Supabase Auth.

---

## Deploy na Vercel

### 1. Preparar

```bash
# Build de teste
yarn build
```

### 2. Deploy

1. Push o repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Import o repositório
4. Configure as variáveis de ambiente (as mesmas do `.env.local`)
5. Deploy!

### 3. Migrations no Supabase

As migrations já devem estar aplicadas no seu projeto Supabase. Se não estiverem:
1. Vá ao SQL Editor do Supabase
2. Execute o conteúdo dos arquivos na ordem correta

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/login/        # Login
│   ├── (app)/               # Rotas autenticadas
│   │   ├── dashboard/       # Dashboard com métricas
│   │   ├── clientes/        # CRUD clientes
│   │   ├── veiculos/        # CRUD veículos
│   │   ├── orcamentos/      # CRUD orçamentos
│   │   ├── kanban/          # Funil visual
│   │   ├── followups/       # Tarefas e lembretes
│   │   └── configuracoes/   # Config (em breve)
│   ├── aprovar/[token]/     # ✨ Público: aprovação
│   └── o/[token]/           # ✨ Público: PDF
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Sidebar
│   └── providers.tsx        # React Query provider
├── hooks/                   # TanStack Query hooks
├── lib/
│   ├── supabase/            # Client + Server
│   ├── validators/          # Zod schemas
│   ├── utils/               # Helpers
│   └── adapters/            # WhatsApp, PDF
└── types/                   # TypeScript types
```

---

## Regras de Negócio

- Toda query filtra por `oficina_id` (RLS)
- Placa é identificador único por oficina
- Orçamento aprovado não pode ser editado
- Follow-up só é criado se orçamento não estiver aprovado ou perdido
- Token público expira em 7 dias
- Só owner e admin podem excluir registros

---

## Licença

Projeto privado — OficinaFlow.
