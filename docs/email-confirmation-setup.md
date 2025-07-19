# Configuração de Confirmação de Email - PetBook

Este documento explica como configurar a confirmação de email no PetBook para maior segurança.

## 🎯 Objetivo

Implementar confirmação de email obrigatória para:

- ✅ Prevenir criação de contas falsas
- ✅ Verificar que o email é válido e pertence ao usuário
- ✅ Melhorar a segurança do sistema
- ✅ Reduzir spam e contas maliciosas

## 📧 Configuração dos Templates de Email

### 1. Obter Access Token do Supabase

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Copie o token gerado

### 2. Configurar Variável de Ambiente

```bash
export SUPABASE_ACCESS_TOKEN="seu_token_aqui"
```

### 3. Executar Script de Atualização

```bash
# Opção 1: Usar o script shell
./scripts/update-templates.sh

# Opção 2: Executar diretamente
node scripts/update-email-templates.js
```

## 🔧 Configurações do Supabase

### Habilitar Confirmação de Email

1. Acesse o Dashboard do Supabase
2. Vá em **Authentication** > **Providers**
3. Em **Email**, certifique-se que:
   - ✅ **Enable email confirmations** está ativado
   - ✅ **Enable signup** está ativado

### Configurar URLs de Redirecionamento

1. Vá em **Authentication** > **URL Configuration**
2. Configure:
   - **Site URL**: `https://seu-dominio.com`
   - **Redirect URLs**:
     - `https://seu-dominio.com/auth/confirm`
     - `https://seu-dominio.com/auth/callback`

## 📱 Fluxo de Confirmação

### 1. Usuário se Cadastra

- Preenche formulário de signup
- Sistema cria conta temporária
- Email de confirmação é enviado

### 2. Email de Confirmação

- Usuário recebe email personalizado do PetBook
- Email contém link de confirmação
- Design profissional com branding do PetBook

### 3. Confirmação da Conta

- Usuário clica no link do email
- Sistema verifica o token
- Conta é ativada e usuário é redirecionado para dashboard

### 4. Criação do Perfil

- Se o perfil não existir, é criado automaticamente
- Dados do pet shop são salvos
- Usuário pode acessar o sistema

## 🎨 Templates de Email

### Confirmação de Conta

- **Assunto**: "Confirme sua conta PetBook"
- **Conteúdo**: Email profissional com branding do PetBook
- **Ação**: Botão "Confirmar Email"

### Redefinição de Senha

- **Assunto**: "Redefinir senha PetBook"
- **Conteúdo**: Instruções para redefinir senha
- **Ação**: Botão "Redefinir Senha"

### Link Mágico

- **Assunto**: "Seu link mágico PetBook"
- **Conteúdo**: Login sem senha
- **Ação**: Botão "Fazer Login"

## 🔒 Segurança

### Medidas Implementadas

- ✅ Confirmação obrigatória de email
- ✅ Tokens com expiração (24h para confirmação, 1h para recuperação)
- ✅ Links seguros com hash de token
- ✅ Prevenção contra contas falsas
- ✅ Verificação de propriedade do email

### Configurações de Segurança

- **Expiração de token**: 24 horas para confirmação
- **Expiração de recuperação**: 1 hora
- **Rate limiting**: Configurado no Supabase
- **Validação de email**: Regex e verificação de domínio

## 🚀 Testando

### 1. Teste Local

```bash
# Iniciar aplicação
npm run dev

# Acessar signup
http://localhost:3000/auth/signup
```

### 2. Teste de Email

- Use um email real para testar
- Verifique a caixa de spam
- Teste o link de confirmação

### 3. Verificação no Supabase

```sql
-- Verificar usuários não confirmados
SELECT * FROM auth.users WHERE email_confirmed_at IS NULL;

-- Verificar usuários confirmados
SELECT * FROM auth.users WHERE email_confirmed_at IS NOT NULL;
```

## 🛠️ Troubleshooting

### Email não chega

1. Verificar configuração SMTP do Supabase
2. Verificar caixa de spam
3. Verificar se o email está correto

### Link não funciona

1. Verificar se o token não expirou
2. Verificar configuração de URLs
3. Verificar logs do Supabase

### Erro de confirmação

1. Verificar se o usuário já foi confirmado
2. Verificar se o token é válido
3. Verificar logs da aplicação

## 📋 Checklist de Implementação

- [ ] Configurar SUPABASE_ACCESS_TOKEN
- [ ] Executar script de templates
- [ ] Habilitar confirmação de email no Supabase
- [ ] Configurar URLs de redirecionamento
- [ ] Testar fluxo completo
- [ ] Verificar templates no dashboard
- [ ] Configurar SMTP personalizado (opcional)

## 🔄 Próximos Passos

1. **Configurar SMTP personalizado** para produção
2. **Implementar rate limiting** adicional
3. **Adicionar logs** de confirmação
4. **Implementar notificações** de falha
5. **Criar dashboard** de monitoramento

---

**Nota**: Esta configuração garante que apenas usuários com emails válidos possam criar contas no PetBook, melhorando significativamente a segurança do sistema.
