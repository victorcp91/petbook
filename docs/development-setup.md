# Guia de Configuração do Ambiente de Desenvolvimento - PetBook

Este guia fornece instruções detalhadas para configurar o ambiente de desenvolvimento do PetBook.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do IDE](#configuração-do-ide)
- [Configuração do Supabase](#configuração-do-supabase)
- [Scripts de Desenvolvimento](#scripts-de-desenvolvimento)
- [Debugging](#debugging)
- [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)

## 🛠️ Pré-requisitos

### Software Necessário

- **Node.js 18+**: [Download](https://nodejs.org/)
- **npm 8+**: Incluído com Node.js
- **Git**: [Download](https://git-scm.com/)
- **VS Code** (recomendado): [Download](https://code.visualstudio.com/)

### Verificação de Instalação

```bash
# Verificar versões
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 8.0.0
git --version     # Qualquer versão recente
```

### Extensões VS Code Recomendadas

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-git-graph",
    "ms-vscode.vscode-github",
    "ms-vscode.vscode-js-debug"
  ]
}
```

## 🚀 Instalação

### 1. Clone do Repositório

```bash
# Clone o repositório
git clone https://github.com/your-org/petbook.git
cd petbook

# Configure o upstream (se você fez fork)
git remote add upstream https://github.com/your-org/petbook.git
```

### 2. Instalação de Dependências

```bash
# Instalar todas as dependências
npm install

# Verificar instalação
npm run verify:install
```

### 3. Configuração de Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp apps/web/.env.example apps/web/.env.local

# Editar variáveis de ambiente
nano apps/web/.env.local
```

**Conteúdo do `.env.local`:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Optional: Debug Mode
NEXT_PUBLIC_DEBUG=true
```

### 4. Verificação da Instalação

```bash
# Executar testes
npm test

# Verificar linting
npm run lint

# Verificar tipos
npm run type-check

# Build de desenvolvimento
npm run build:dev
```

## ⚙️ Configuração do IDE

### VS Code Settings

**Arquivo**: `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "([^)]*)"],
    ["clsx\\(([^)]*)\\)", "([^)]*)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true
}
```

### VS Code Launch Configuration

**Arquivo**: `.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/web/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/web",
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/apps/web"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/web/node_modules/next/dist/bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/apps/web",
      "console": "integratedTerminal",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### VS Code Tasks

**Arquivo**: `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm",
      "args": ["run", "dev"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm",
      "args": ["test"],
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Run Lint",
      "type": "shell",
      "command": "npm",
      "args": ["run", "lint"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Type Check",
      "type": "shell",
      "command": "npm",
      "args": ["run", "type-check"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

## 🗄️ Configuração do Supabase

### 1. Instalação do Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Verificar instalação
supabase --version
```

### 2. Configuração do Projeto Local

```bash
# Inicializar Supabase local
supabase init

# Iniciar Supabase local
supabase start

# Verificar status
supabase status
```

### 3. Configuração de Variáveis de Ambiente

```bash
# Obter credenciais do projeto local
supabase status

# Configurar variáveis de ambiente para desenvolvimento local
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
export SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

### 4. Migrations e Schema

```bash
# Aplicar migrations
supabase db push

# Verificar schema
supabase db diff

# Resetar banco local
supabase db reset
```

## 📜 Scripts de Desenvolvimento

### Scripts Principais

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # ESLint com auto-fix
npm run format       # Formata código com Prettier
npm run type-check   # Verifica tipos TypeScript

# Testes
npm test             # Executa todos os testes
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com cobertura
npm run test:ci      # Testes para CI

# Build e Deploy
npm run build:dev    # Build de desenvolvimento
npm run build:prod   # Build de produção
npm run analyze      # Analisa bundle size

# Utilitários
npm run clean        # Limpa arquivos temporários
npm run verify:install # Verifica instalação
npm run deps:check   # Verifica dependências
npm run deps:update  # Atualiza dependências
```

### Scripts de Debug

```bash
# Debug específico
npm run debug:api    # Debug da API
npm run debug:db     # Debug do banco de dados
npm run debug:auth   # Debug de autenticação

# Logs detalhados
npm run dev:verbose  # Dev server com logs detalhados
npm run build:debug  # Build com debug info
```

## 🐛 Debugging

### Debug Local

```bash
# Debug com Node.js
node --inspect apps/web/.next/server/pages/index.js

# Debug com Chrome DevTools
# 1. Abra Chrome DevTools
# 2. Clique no ícone do Node.js
# 3. Conecte ao processo de debug

# Debug com VS Code
# 1. Pressione F5
# 2. Selecione "Next.js: debug server-side"
# 3. Configure breakpoints
```

### Debug de Componentes React

```typescript
// apps/web/lib/debug.ts
export const debugComponent = (componentName: string, props: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${componentName} rendered:`, props);
  }
};

// Uso em componentes
import { debugComponent } from '@/lib/debug';

export const Button = ({ children, ...props }) => {
  debugComponent('Button', props);

  return (
    <button {...props}>
      {children}
    </button>
  );
};
```

### Debug de API Calls

```typescript
// apps/web/lib/api-debug.ts
export const debugApiCall = (endpoint: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${endpoint}:`, data);
  }
};

// Uso em hooks
const useApi = (endpoint: string) => {
  const fetchData = async () => {
    debugApiCall(endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    debugApiCall(endpoint, data);
    return data;
  };

  return { fetchData };
};
```

## 🔄 Workflow de Desenvolvimento

### 1. Iniciando um Novo Feature

```bash
# 1. Atualizar branch principal
git checkout main
git pull upstream main

# 2. Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 3. Desenvolver feature
npm run dev
# ... desenvolvimento ...

# 4. Testar mudanças
npm test
npm run lint
npm run type-check

# 5. Commit e push
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### 2. Code Review Process

```bash
# 1. Criar Pull Request
# - Vá para GitHub
# - Clique em "New Pull Request"
# - Selecione sua branch

# 2. Verificações automáticas
# - CI/CD pipeline executa
# - Testes são executados
# - Linting é verificado

# 3. Code review
# - Revisor analisa código
# - Sugestões são feitas
# - Mudanças são aplicadas

# 4. Merge
# - Após aprovação
# - Merge para main
```

### 3. Hotfix Process

```bash
# 1. Criar branch hotfix
git checkout main
git checkout -b hotfix/correcao-urgente

# 2. Aplicar correção
# ... correção ...

# 3. Testar
npm test
npm run build

# 4. Commit e merge
git add .
git commit -m "fix: correção urgente"
git checkout main
git merge hotfix/correcao-urgente
git push origin main
```

### 4. Release Process

```bash
# 1. Preparar release
git checkout main
git pull upstream main

# 2. Atualizar versão
npm version patch  # ou minor/major

# 3. Criar tag
git tag v1.0.0
git push origin v1.0.0

# 4. Criar release no GitHub
# - Vá para GitHub > Releases
# - Clique em "Create a new release"
# - Selecione a tag
# - Adicione release notes
# - Publique
```

## 📚 Recursos Adicionais

### Documentação Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Ferramentas Úteis

- **React Developer Tools**: Extensão do Chrome
- **Redux DevTools**: Para debugging de estado
- **Postman**: Para testar APIs
- **Insomnia**: Alternativa ao Postman

### Comandos Úteis

```bash
# Verificar saúde do projeto
npm run health:check

# Limpar cache
npm run clean:cache

# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix
```

---

**PetBook Development Setup** - Ambiente de desenvolvimento otimizado 🚀
