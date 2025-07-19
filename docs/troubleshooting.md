# Troubleshooting Guide - PetBook

Este guia fornece soluções para problemas comuns encontrados durante o desenvolvimento e deploy do PetBook.

## 📋 Índice

- [Problemas de Desenvolvimento](#problemas-de-desenvolvimento)
- [Problemas de Build](#problemas-de-build)
- [Problemas de Deploy](#problemas-de-deploy)
- [Problemas de Banco de Dados](#problemas-de-banco-de-dados)
- [Problemas de Autenticação](#problemas-de-autenticação)
- [Problemas de Performance](#problemas-de-performance)
- [Debugging](#debugging)
- [Suporte](#suporte)

## 🛠️ Problemas de Desenvolvimento

### 1. Dependências não Instalam

**Sintomas:**

```bash
npm ERR! ERESOLVE could not resolve
npm ERR! ERESOLVE overriding peer dependency
```

**Soluções:**

```bash
# Limpar cache npm
npm cache clean --force

# Remover node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar dependências
npm install

# Se persistir, usar npm install --legacy-peer-deps
npm install --legacy-peer-deps
```

### 2. TypeScript Errors

**Sintomas:**

```bash
Type 'X' is not assignable to type 'Y'
Property 'X' does not exist on type 'Y'
```

**Soluções:**

```bash
# Verificar tipos
npm run type-check

# Regenerar tipos do Supabase
npx supabase gen types typescript --project-id your-project-id > packages/api/database.ts

# Limpar cache TypeScript
rm -rf apps/web/.next
rm -rf packages/*/dist
```

### 3. ESLint Errors

**Sintomas:**

```bash
ESLint: Parsing error: Unexpected token
ESLint: 'X' is not defined
```

**Soluções:**

```bash
# Executar lint com auto-fix
npm run lint -- --fix

# Verificar configuração ESLint
npx eslint --print-config apps/web/src/components/Button.tsx

# Resetar configuração ESLint
rm .eslintrc.js
npm run lint:init
```

### 4. Testes Falham

**Sintomas:**

```bash
Jest encountered an unexpected token
Test failed: Expected X but received Y
```

**Soluções:**

```bash
# Limpar cache Jest
npm run test -- --clearCache

# Executar testes específicos
npm test -- --testNamePattern="Button"

# Verificar configuração Jest
npm run test:config

# Debug testes
npm test -- --verbose --no-coverage
```

## 🔨 Problemas de Build

### 1. Build Falha no Vercel

**Sintomas:**

```bash
Build failed: Module not found
Build failed: TypeScript compilation error
```

**Soluções:**

```bash
# Testar build local
npm run build

# Verificar variáveis de ambiente
npm run env:check

# Verificar dependências
npm run deps:check

# Build com debug
npm run build -- --debug
```

### 2. Bundle Size Muito Grande

**Sintomas:**

```bash
Bundle size exceeds 250KB
First Load JS shared by all pages: 500KB
```

**Soluções:**

```bash
# Analisar bundle
npm run analyze

# Verificar imports desnecessários
npm run bundle:check

# Otimizar imports
# Use dynamic imports para componentes grandes
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />
});
```

### 3. Imagens não Carregam

**Sintomas:**

```bash
Failed to load resource: net::ERR_FILE_NOT_FOUND
Image optimization failed
```

**Soluções:**

```bash
# Verificar configuração Next.js Image
# next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif']
  }
}

# Verificar permissões de storage
# Supabase Dashboard > Storage > Policies
```

## 🚀 Problemas de Deploy

### 1. Deploy Falha no GitHub Actions

**Sintomas:**

```bash
GitHub Actions: Build step failed
GitHub Actions: Deploy step failed
```

**Soluções:**

```bash
# Verificar secrets GitHub
# Settings > Secrets and variables > Actions

# Verificar workflow YAML
# .github/workflows/deploy-staging.yml

# Testar workflow local
act -j deploy

# Verificar logs detalhados
# GitHub Actions > Run > View logs
```

### 2. Vercel Deploy Falha

**Sintomas:**

```bash
Vercel: Build failed
Vercel: Function timeout
```

**Soluções:**

```bash
# Verificar vercel.json
cat vercel.json

# Verificar variáveis de ambiente Vercel
vercel env ls

# Deploy manual para debug
vercel --debug

# Verificar logs Vercel
# Vercel Dashboard > Deployments > View Function Logs
```

### 3. Supabase Connection Issues

**Sintomas:**

```bash
Failed to fetch: 401 Unauthorized
Supabase: Invalid API key
```

**Soluções:**

```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Testar conexão Supabase
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your_anon_key"

# Verificar RLS policies
supabase db diff --schema public
```

## 🗄️ Problemas de Banco de Dados

### 1. RLS (Row Level Security) Issues

**Sintomas:**

```bash
new row violates row-level security policy
RLS policy violation
```

**Soluções:**

```sql
-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE schemaname = 'public';

-- Recriar política
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

### 2. Migration Issues

**Sintomas:**

```bash
Migration failed: column already exists
Migration failed: table does not exist
```

**Soluções:**

```bash
# Verificar status das migrations
supabase migration list

# Resetar banco de dados
supabase db reset

# Aplicar migrations manualmente
supabase db push

# Verificar schema
supabase db diff
```

### 3. Performance Issues

**Sintomas:**

```bash
Slow query execution
Database connection timeout
```

**Soluções:**

```sql
-- Adicionar índices
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Otimizar queries
EXPLAIN ANALYZE SELECT * FROM pets WHERE owner_id = 'user-id';

-- Verificar estatísticas
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats WHERE schemaname = 'public';
```

## 🔐 Problemas de Autenticação

### 1. Login Falha

**Sintomas:**

```bash
Invalid login credentials
User not found
```

**Soluções:**

```bash
# Verificar configuração Supabase Auth
# Supabase Dashboard > Authentication > Settings

# Verificar providers configurados
# Supabase Dashboard > Authentication > Providers

# Testar login programaticamente
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password'
});
console.log('Login result:', { data, error });
```

### 2. Session Issues

**Sintomas:**

```bash
Session expired
Invalid session token
```

**Soluções:**

```typescript
// Verificar sessão atual
const {
  data: { session },
} = await supabase.auth.getSession();

// Refresh session
const { data, error } = await supabase.auth.refreshSession();

// Escutar mudanças de auth
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});
```

### 3. Permission Issues

**Sintomas:**

```bash
Permission denied
Insufficient privileges
```

**Soluções:**

```sql
-- Verificar role do usuário
SELECT auth.uid(), users.role FROM users WHERE id = auth.uid();

-- Verificar políticas de permissão
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Adicionar role se necessário
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## ⚡ Problemas de Performance

### 1. Slow Page Load

**Sintomas:**

```bash
First Contentful Paint > 2s
Largest Contentful Paint > 4s
```

**Soluções:**

```bash
# Analisar performance
npm run lighthouse

# Otimizar imagens
npm run optimize:images

# Verificar Core Web Vitals
# Chrome DevTools > Performance > Web Vitals

# Implementar lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));
```

### 2. Memory Leaks

**Sintomas:**

```bash
Memory usage increasing over time
Component unmounting issues
```

**Soluções:**

```typescript
// Limpar event listeners
useEffect(() => {
  const handleResize = () => {
    /* ... */
  };
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Limpar subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('custom-all-channel')
    .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
      console.log('Change received!', payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 3. API Timeouts

**Sintomas:**

```bash
Request timeout after 30s
API calls taking too long
```

**Soluções:**

```typescript
// Implementar retry logic
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3
) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// Implementar caching
const useCachedData = (key: string, fetcher: () => Promise<any>) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) {
      setData(JSON.parse(cached));
      setLoading(false);
    }

    fetcher().then(result => {
      setData(result);
      localStorage.setItem(key, JSON.stringify(result));
      setLoading(false);
    });
  }, [key, fetcher]);

  return { data, loading };
};
```

## 🐛 Debugging

### 1. Debug Local

```bash
# Debug com Node.js
node --inspect apps/web/.next/server/pages/index.js

# Debug com Chrome DevTools
# Chrome > DevTools > Sources > Add source map

# Debug com VS Code
# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/apps/web/node_modules/next/dist/bin/next",
      "args": ["start"],
      "cwd": "${workspaceFolder}/apps/web",
      "console": "integratedTerminal"
    }
  ]
}
```

### 2. Debug Production

```typescript
// apps/web/lib/debug.ts
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG) {
    console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, data);
  }
};

// Usar em componentes
debugLog('Component rendered', { props, state });
```

### 3. Error Tracking

```typescript
// apps/web/lib/error-tracking.ts
export const trackError = (error: Error, context?: string) => {
  console.error(`[ERROR] ${context || 'App'}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  });

  // Enviar para serviço de tracking (Sentry, etc.)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry.captureException(error);
  }
};
```

## 📞 Suporte

### 1. Logs Úteis

```bash
# Logs do Next.js
npm run dev 2>&1 | tee nextjs.log

# Logs do Supabase
# Supabase Dashboard > Logs

# Logs do Vercel
# Vercel Dashboard > Deployments > Function Logs

# Logs do GitHub Actions
# GitHub > Actions > Workflow > Run > View logs
```

### 2. Comandos de Diagnóstico

```bash
# Verificar saúde do sistema
npm run health:check

# Verificar dependências
npm run deps:audit

# Verificar configuração
npm run config:check

# Testar conectividade
npm run connectivity:test
```

### 3. Recursos de Ajuda

- **GitHub Issues**: [Reportar bugs](https://github.com/your-org/petbook/issues)
- **Discord**: [Comunidade PetBook](https://discord.gg/petbook)
- **Documentação**: [docs.petbook.com](https://docs.petbook.com)
- **Email**: support@petbook.com

### 4. Checklist de Troubleshooting

- [ ] Verificar logs de erro
- [ ] Testar em ambiente limpo
- [ ] Verificar variáveis de ambiente
- [ ] Confirmar conectividade de rede
- [ ] Verificar permissões de arquivo
- [ ] Testar com dados mínimos
- [ ] Verificar versões de dependências
- [ ] Consultar documentação oficial

---

**PetBook Troubleshooting** - Resolvendo problemas rapidamente 🔧
