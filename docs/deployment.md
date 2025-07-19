# Guia de Deploy - PetBook

Este documento descreve o processo de deploy do PetBook, incluindo configuração de ambientes, CI/CD pipeline e estratégias de deployment.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Ambientes](#ambientes)
- [CI/CD Pipeline](#cicd-pipeline)
- [Configuração de Ambientes](#configuração-de-ambientes)
- [Deploy Manual](#deploy-manual)
- [Monitoramento](#monitoramento)
- [Troubleshooting](#troubleshooting)

## 🏗️ Visão Geral

O PetBook utiliza uma estratégia de deploy moderna com:

- **Vercel** para hosting frontend
- **Supabase** para backend (banco, auth, storage)
- **GitHub Actions** para CI/CD
- **Ambientes separados** para staging e produção

### Arquitetura de Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│     Vercel      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    Supabase     │
                       │  (Database,     │
                       │   Auth, Storage)│
                       └─────────────────┘
```

## 🌍 Ambientes

### Staging (Desenvolvimento)

- **URL**: `https://staging.petbook.com`
- **Branch**: `develop`
- **Deploy**: Automático no push
- **Database**: Supabase Staging Project
- **Purpose**: Testes e validação

### Produção

- **URL**: `https://petbook.com`
- **Branch**: `main`
- **Deploy**: Manual via GitHub Releases
- **Database**: Supabase Production Project
- **Purpose**: Usuários finais

## 🔄 CI/CD Pipeline

### Workflows GitHub Actions

#### 1. CI (Continuous Integration)

**Arquivo**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Run linting
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build
```

#### 2. Deploy Staging

**Arquivo**: `.github/workflows/deploy-staging.yml`

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### 3. Deploy Production

**Arquivo**: `.github/workflows/deploy-production.yml`

```yaml
name: Deploy to Production

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.PRODUCTION_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PRODUCTION_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Configuração do Vercel

**Arquivo**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["gru1"],
  "functions": {
    "apps/web/.next/server/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## ⚙️ Configuração de Ambientes

### Variáveis de Ambiente

#### Staging

```env
# apps/web/.env.staging
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
NEXT_PUBLIC_APP_URL=https://staging.petbook.com
NODE_ENV=staging
```

#### Produção

```env
# apps/web/.env.production
NEXT_PUBLIC_SUPABASE_URL=https://production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://petbook.com
NODE_ENV=production
```

### Secrets GitHub

Configure os seguintes secrets no repositório:

#### Vercel

- `VERCEL_TOKEN`: Token de API do Vercel
- `VERCEL_ORG_ID`: ID da organização Vercel
- `VERCEL_PROJECT_ID`: ID do projeto Vercel

#### Supabase Staging

- `STAGING_SUPABASE_URL`: URL do projeto Supabase staging
- `STAGING_SUPABASE_ANON_KEY`: Chave anônima do Supabase staging
- `STAGING_SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase staging

#### Supabase Production

- `PRODUCTION_SUPABASE_URL`: URL do projeto Supabase produção
- `PRODUCTION_SUPABASE_ANON_KEY`: Chave anônima do Supabase produção
- `PRODUCTION_SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase produção

### Configuração do Supabase

#### 1. Criar Projetos

```bash
# Staging
supabase projects create petbook-staging

# Production
supabase projects create petbook-production
```

#### 2. Configurar RLS Policies

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Owners can view their pets" ON pets
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'groomer', 'attendant')
    )
  );
```

#### 3. Configurar Storage

```sql
-- Criar bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true);

-- Política para upload de imagens
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pet-images');

-- Política para visualizar imagens
CREATE POLICY "Users can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pet-images');
```

## 🚀 Deploy Manual

### Deploy para Staging

```bash
# 1. Fazer push para develop
git checkout develop
git pull origin develop
git push origin develop

# 2. Verificar deploy no GitHub Actions
# https://github.com/your-org/petbook/actions
```

### Deploy para Produção

```bash
# 1. Criar release no GitHub
git checkout main
git pull origin main

# 2. Criar tag
git tag v1.0.0
git push origin v1.0.0

# 3. Criar release no GitHub
# - Vá para https://github.com/your-org/petbook/releases
# - Clique em "Create a new release"
# - Selecione a tag v1.0.0
# - Adicione release notes
# - Publique o release
```

### Deploy Local para Teste

```bash
# Build local
npm run build

# Testar build
npm run start

# Verificar variáveis de ambiente
npm run env:check
```

## 📊 Monitoramento

### Vercel Analytics

Configure analytics no Vercel:

```typescript
// apps/web/lib/analytics.ts
import { Analytics } from '@vercel/analytics/react';

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

### Logs e Métricas

#### GitHub Actions

- **Logs de CI**: Disponível em cada workflow run
- **Tempo de build**: Monitorado automaticamente
- **Status de deploy**: Notificações configuradas

#### Vercel

- **Performance**: Core Web Vitals
- **Erros**: Error tracking automático
- **Uptime**: Monitoramento de disponibilidade

#### Supabase

- **Database logs**: Disponível no dashboard
- **Auth logs**: Login/logout events
- **Storage logs**: Upload/download events

### Alertas

Configure alertas para:

- **Build failures**: Notificação no Slack/Discord
- **Deploy failures**: Email para equipe
- **Performance issues**: Alertas de Core Web Vitals
- **Error spikes**: Alertas de erro em produção

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Build Falha

```bash
# Verificar dependências
npm ci

# Limpar cache
npm run clean

# Verificar tipos
npm run type-check

# Verificar linting
npm run lint
```

#### 2. Deploy Falha

```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL

# Verificar secrets GitHub
# Vá para Settings > Secrets and variables > Actions

# Verificar logs Vercel
# Vá para Vercel Dashboard > Deployments
```

#### 3. Supabase Connection Issues

```bash
# Verificar URL e chaves
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your_anon_key"

# Verificar RLS policies
supabase db diff --schema public
```

#### 4. Performance Issues

```bash
# Analisar bundle size
npm run analyze

# Verificar Core Web Vitals
# Use Lighthouse ou Vercel Analytics

# Otimizar imagens
npm run optimize:images
```

### Comandos Úteis

```bash
# Verificar status dos ambientes
npm run env:check

# Testar conexão com Supabase
npm run test:supabase

# Verificar configuração Vercel
vercel env ls

# Deploy manual para staging
vercel --prod --env staging

# Rollback para versão anterior
vercel rollback
```

### Logs de Debug

```typescript
// apps/web/lib/debug.ts
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Uso
debugLog('API call', { endpoint: '/api/pets', duration: 150 });
```

## 📚 Recursos Adicionais

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**PetBook Deploy** - Deploy seguro e confiável 🚀
