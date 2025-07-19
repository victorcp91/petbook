# PetBook - SaaS para Digitalização do Livro de Banho & Tosa

[![CI](https://github.com/your-org/petbook/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/petbook/actions/workflows/ci.yml)
[![Deploy to Staging](https://github.com/your-org/petbook/actions/workflows/deploy-staging.yml/badge.svg)](https://github.com/your-org/petbook/actions/workflows/deploy-staging.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PetBook é uma plataforma SaaS moderna para digitalizar e gerenciar registros de banho e tosa de pets, oferecendo uma solução completa para pet shops e profissionais do setor.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Monorepo**: Turbo, npm workspaces
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions, Vercel
- **PWA**: Next.js PWA support

## 📁 Estrutura do Projeto

```
petbook/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── api/                 # Supabase client & types
│   ├── ui/                  # Shared UI components
│   ├── utils/               # Utility functions
│   └── config/              # Shared configurations
├── .github/workflows/       # CI/CD pipelines
├── docs/                    # Documentation
└── scripts/                 # Build & deployment scripts
```

## 🛠️ Configuração Local

### Pré-requisitos

- Node.js 18+
- npm 8+
- Git

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/your-org/petbook.git
   cd petbook
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Edite `apps/web/.env.local` com suas credenciais do Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

O projeto estará disponível em `http://localhost:3000`

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes para CI
npm run test:ci
```

## 🔧 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Constrói o projeto para produção
npm run start        # Inicia o servidor de produção
```

### Qualidade de Código

```bash
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
npm run format       # Formata código com Prettier
npm run format:check # Verifica formatação
```

### CI/CD

```bash
npm run ci:check     # Verificação completa para CI
npm run ci:build     # Build para CI
npm run security:audit # Auditoria de segurança
```

### Dependências

```bash
npm run deps:check   # Verifica dependências desatualizadas
npm run deps:update  # Atualiza dependências
npm run deps:audit   # Auditoria e correção de dependências
```

## 🚀 Deploy

### Staging

- Deploy automático no branch `develop`
- URL: `https://staging.petbook.com`

### Produção

- Deploy manual via GitHub Releases
- URL: `https://petbook.com`

## 📚 Documentação

- [Guia de Contribuição](./CONTRIBUTING.md)
- [Documentação da API](./docs/api.md)
- [Guia de Deploy](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [CI/CD Pipeline](./.github/README.md)

## 🤝 Contribuindo

Veja o [Guia de Contribuição](./CONTRIBUTING.md) para detalhes sobre como contribuir com o projeto.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/your-org/petbook/issues)
- **Discord**: [Comunidade PetBook](https://discord.gg/petbook)
- **Email**: support@petbook.com

## 🏗️ Arquitetura

### Frontend (Next.js)

- **Páginas**: App Router com TypeScript
- **Componentes**: shadcn/ui + Radix UI
- **Estilização**: Tailwind CSS
- **Estado**: React Query + Zustand
- **PWA**: Service Worker + Manifest

### Backend (Supabase)

- **Banco**: PostgreSQL com Row Level Security
- **Auth**: Supabase Auth com múltiplos provedores
- **Storage**: File upload para imagens
- **Realtime**: WebSocket para atualizações em tempo real
- **Edge Functions**: Serverless functions

### Monorepo

- **Build**: Turbo para build otimizado
- **Packages**: npm workspaces
- **Testing**: Jest com configuração compartilhada
- **Linting**: ESLint com presets compartilhados

## 🔒 Segurança

- **Autenticação**: Supabase Auth com JWT
- **Autorização**: Row Level Security (RLS)
- **CORS**: Configurado para domínios específicos
- **HTTPS**: Forçado em produção
- **Auditoria**: Logs de segurança centralizados

## 📊 Monitoramento

- **Performance**: Vercel Analytics
- **Erros**: Sentry integration
- **Logs**: Supabase Logs + GitHub Actions
- **Métricas**: Custom dashboard

---

**PetBook** - Digitalizando o cuidado com pets desde 2024 🐾
