# Guia de Contribuição - PetBook

Obrigado por considerar contribuir com o PetBook! Este documento fornece diretrizes para contribuições ao projeto.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Convenções de Commit](#convenções-de-commit)
- [Testes](#testes)
- [Documentação](#documentação)

## 🤝 Como Contribuir

### Tipos de Contribuições

- **🐛 Bug Fixes**: Correções de bugs
- **✨ Features**: Novas funcionalidades
- **📚 Documentation**: Melhorias na documentação
- **🧪 Tests**: Adição ou melhoria de testes
- **🔧 Refactoring**: Melhorias no código
- **⚡ Performance**: Otimizações de performance

### Antes de Começar

1. **Verifique se já existe uma issue** para o que você quer contribuir
2. **Crie uma issue** se não existir uma
3. **Discuta a implementação** na issue antes de começar
4. **Espere aprovação** antes de implementar

## 🛠️ Configuração do Ambiente

### Pré-requisitos

```bash
# Node.js 18+
node --version

# npm 8+
npm --version

# Git
git --version
```

### Setup Local

1. **Fork o repositório**

   ```bash
   # Clone seu fork
   git clone https://github.com/seu-usuario/petbook.git
   cd petbook

   # Adicione o repositório original como upstream
   git remote add upstream https://github.com/your-org/petbook.git
   ```

2. **Instale dependências**

   ```bash
   npm install
   ```

3. **Configure variáveis de ambiente**

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   # Edite apps/web/.env.local com suas credenciais
   ```

4. **Execute testes**
   ```bash
   npm test
   ```

## 📝 Padrões de Código

### TypeScript

- **Use TypeScript strict mode**
- **Defina tipos explícitos** para props e funções
- **Use interfaces** para objetos complexos
- **Evite `any`** - use `unknown` quando necessário

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ Evite
const getUser = async (id: any): Promise<any> => {
  // implementation
};
```

### React Components

- **Use functional components** com hooks
- **Prefira named exports**
- **Use TypeScript para props**

```typescript
// ✅ Bom
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case (`user-profile.tsx`)
- **Directories**: kebab-case (`components/`)

### CSS/Tailwind

- **Use Tailwind CSS** para estilização
- **Prefira classes utilitárias** sobre CSS customizado
- **Use cn()** para combinar classes condicionalmente

```typescript
// ✅ Bom
<div className={cn(
  "flex items-center justify-between",
  "p-4 bg-white rounded-lg shadow",
  isActive && "ring-2 ring-blue-500"
)}>
```

## 🔄 Processo de Pull Request

### 1. Prepare sua Branch

```bash
# Crie uma branch a partir de main
git checkout main
git pull upstream main
git checkout -b feature/nova-funcionalidade

# Ou para bug fixes
git checkout -b fix/correcao-bug
```

### 2. Desenvolva sua Feature

- **Escreva testes** para novas funcionalidades
- **Atualize documentação** se necessário
- **Siga os padrões de código**
- **Execute testes localmente**

```bash
# Execute testes
npm test

# Verifique linting
npm run lint

# Verifique tipos
npm run type-check

# Formate código
npm run format
```

### 3. Commit suas Mudanças

```bash
# Adicione arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona autenticação com Google"

# Push para seu fork
git push origin feature/nova-funcionalidade
```

### 4. Crie o Pull Request

1. **Vá para GitHub** e crie um PR
2. **Use o template** de Pull Request
3. **Descreva as mudanças** claramente
4. **Link para issues** relacionadas
5. **Adicione screenshots** se aplicável

### Template de Pull Request

```markdown
## Descrição

Breve descrição das mudanças

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Self-review do código foi feito
- [ ] Mudanças foram testadas localmente

## Screenshots (se aplicável)
```

## 📝 Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commit
feat: nova funcionalidade
fix: correção de bug
docs: mudanças na documentação
style: formatação, ponto e vírgula, etc.
refactor: refatoração de código
test: adição ou correção de testes
chore: mudanças em build, config, etc.

# Exemplos
git commit -m "feat: adiciona autenticação com Google"
git commit -m "fix: corrige erro de validação no formulário"
git commit -m "docs: atualiza README com instruções de setup"
git commit -m "test: adiciona testes para UserProfile component"
```

## 🧪 Testes

### Executando Testes

```bash
# Todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage

# Testes específicos
npm test -- --testNamePattern="UserProfile"
```

### Escrevendo Testes

- **Teste componentes** com React Testing Library
- **Teste utilitários** com Jest
- **Use mocks** para dependências externas
- **Teste casos de erro** e edge cases

```typescript
// ✅ Exemplo de teste
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Documentação

### Atualizando Documentação

- **Mantenha README.md atualizado**
- **Documente APIs** novas
- **Atualize CONTRIBUTING.md** se necessário
- **Adicione comentários** em código complexo

### Comentários de Código

```typescript
// ✅ Bom - explique o "porquê", não o "o quê"
// Esta função usa uma cache LRU para evitar múltiplas
// chamadas à API para o mesmo usuário
const getUserWithCache = memoize(getUser);

// ❌ Evite - comentários óbvios
// Função que retorna o usuário
const getUser = () => {
  // ...
};
```

## 🚀 Deploy e CI/CD

### Verificações Automáticas

O CI/CD verifica automaticamente:

- ✅ Testes passam
- ✅ Linting sem erros
- ✅ Type checking sem erros
- ✅ Build bem-sucedido
- ✅ Cobertura de testes adequada

### Deploy

- **Staging**: Deploy automático no branch `develop`
- **Produção**: Deploy manual via GitHub Releases

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
## Descrição do Bug

Descrição clara e concisa do bug

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

Descrição do que deveria acontecer

## Screenshots

Se aplicável, adicione screenshots

## Ambiente

- OS: [ex: iOS]
- Browser: [ex: chrome, safari]
- Version: [ex: 22]

## Informações Adicionais

Qualquer contexto adicional sobre o problema
```

## 💡 Sugerindo Features

### Template de Feature Request

```markdown
## Problema

Descrição do problema que a feature resolveria

## Solução Proposta

Descrição da solução desejada

## Alternativas Consideradas

Outras soluções que você considerou

## Informações Adicionais

Qualquer contexto adicional
```

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/your-org/petbook/issues)
- **Discord**: [Comunidade PetBook](https://discord.gg/petbook)
- **Email**: dev@petbook.com

## 🙏 Agradecimentos

Obrigado por contribuir com o PetBook! Suas contribuições ajudam a melhorar a experiência de todos os usuários da plataforma.

---

**PetBook** - Digitalizando o cuidado com pets desde 2024 🐾
