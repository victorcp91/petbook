# Interface Implementation Guide - PetBook

Este documento explica como os arquivos JSON de layout do Figma devem guiar a implementação das interfaces do PetBook.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura dos Arquivos de Layout](#estrutura-dos-arquivos-de-layout)
- [Design System](#design-system)
- [Mapeamento de Componentes](#mapeamento-de-componentes)
- [Processo de Implementação](#processo-de-implementação)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)

## 🏗️ Visão Geral

Os arquivos JSON na pasta `layouts/` são exportações do Figma que definem:

- **Design System** (`styleguide.json`) - Cores, tipografia, espaçamentos
- **Interfaces de Usuário** - Todas as telas da aplicação
- **Componentes Reutilizáveis** - Elementos de UI padronizados
- **Layouts Responsivos** - Estruturas adaptáveis

### Arquivos Disponíveis

```
layouts/
├── styleguide.json                    # Design System
├── login.json                        # Tela de Login
├── dashboard.json                    # Dashboard Principal
├── onboarding.json                   # Onboarding
├── primeiro_acesso.json              # Primeiro Acesso
├── perfil.json                       # Perfil do Usuário
├── clientes_pets.json               # Lista de Clientes/Pets
├── cliente_pets_cadastro_cliente.json # Cadastro de Cliente
├── cliente_pets_cadastra_pet.json   # Cadastro de Pet
├── agenda-atendente.json             # Agenda do Atendente
├── agenda-groomer.json              # Agenda do Groomer
├── agenda-detalhes.json             # Detalhes da Agenda
├── agenda-groomer-inicio-atendimento.json # Início de Atendimento
├── agenda-groomer-finaliza-atendimento.json # Finalização de Atendimento
├── agenda-groomer-assinatura.json   # Assinatura do Groomer
├── configuracoes_loja.json          # Configurações da Loja
├── configuracoes_usuarios.json      # Configurações de Usuários
├── configuracoes_usuarios_convidar_usuarios.json # Convidar Usuários
├── configuracoes_plano.json         # Configurações do Plano
├── configuracoes_integracoes.json   # Configurações de Integrações
└── relatorios.json                  # Relatórios
```

## 📐 Estrutura dos Arquivos de Layout

### Formato JSON do Figma

Cada arquivo JSON contém:

```json
{
  "id": "unique-id",
  "name": "Nome da Tela",
  "type": "FRAME",
  "width": 1440,
  "height": 809,
  "fills": [
    {
      "type": "SOLID",
      "color": {
        "r": 0.9764705896377563,
        "g": 0.9803921580314636,
        "b": 0.9843137264251709
      }
    }
  ],
  "children": [
    // Elementos aninhados
  ]
}
```

### Propriedades Importantes

- **`fills`**: Cores de fundo
- **`strokes`**: Bordas e outlines
- **`cornerRadius`**: Border radius
- **`effects`**: Sombras e efeitos
- **`layoutMode`**: Flexbox direction
- **`itemSpacing`**: Espaçamento entre elementos
- **`constraints`**: Responsividade

## 🎨 Design System

### Cores Principais

```typescript
// Extraídas do styleguide.json
const colors = {
  // Backgrounds
  background: {
    primary: '#FAFAFA', // r: 0.976, g: 0.980, b: 0.984
    secondary: '#FFFFFF', // r: 1, g: 1, b: 1
    tertiary: '#F5F5F5', // r: 0.960, g: 0.960, b: 0.960
  },

  // Borders
  border: {
    primary: '#E5E7EB', // r: 0.898, g: 0.905, b: 0.921
    secondary: '#CECFD9', // r: 0.807, g: 0.831, b: 0.854
  },

  // Text
  text: {
    primary: '#111827', // r: 0.066, g: 0.094, b: 0.152
    secondary: '#6B7280', // r: 0.419, g: 0.454, b: 0.501
    disabled: '#9CA3AF', // r: 0.611, g: 0.639, b: 0.686
  },

  // Brand Colors
  brand: {
    primary: '#3B82F6', // Blue
    secondary: '#10B981', // Green
    accent: '#F59E0B', // Yellow
  },
};
```

### Tipografia

```typescript
// Baseado no styleguide.json
const typography = {
  fontFamily: {
    primary: 'Inter, sans-serif',
    secondary: 'Roboto, sans-serif',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Espaçamentos

```typescript
// Baseado nos layouts
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};
```

## 🧩 Mapeamento de Componentes

### Componentes Base

```typescript
// packages/ui/src/components/base/
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// Button Component
export interface ButtonProps extends BaseComponentProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// Input Component
export interface InputProps extends BaseComponentProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Card Component
export interface CardProps extends BaseComponentProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'sm' | 'md' | 'lg';
}
```

### Layout Components

```typescript
// packages/ui/src/components/layout/
export interface LayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  userMenu?: React.ReactNode;
  notifications?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: SidebarItem[];
}
```

## 🔄 Processo de Implementação

### 1. Análise do Layout JSON

```typescript
// utils/layout-parser.ts
export interface LayoutElement {
  id: string;
  name: string;
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'INSTANCE';
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: ColorFill[];
  strokes?: ColorStroke[];
  cornerRadius?: number;
  children?: LayoutElement[];
  characters?: string;
  style?: TextStyle;
}

export function parseLayoutFile(jsonContent: string): LayoutElement {
  const data = JSON.parse(jsonContent);
  return extractLayoutStructure(data);
}

export function extractColors(layout: LayoutElement): Color[] {
  const colors: Color[] = [];

  if (layout.fills) {
    layout.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color) {
        colors.push({
          r: fill.color.r * 255,
          g: fill.color.g * 255,
          b: fill.color.b * 255,
          opacity: fill.opacity || 1,
        });
      }
    });
  }

  if (layout.children) {
    layout.children.forEach(child => {
      colors.push(...extractColors(child));
    });
  }

  return colors;
}
```

### 2. Geração de Componentes

```typescript
// utils/component-generator.ts
export function generateComponentFromLayout(
  layout: LayoutElement,
  componentName: string
): string {
  const template = `
import React from 'react';
import { cn } from '@petbook/utils';

interface ${componentName}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Estilos baseados no layout JSON
        'relative',
        className
      )}
      style={{
        width: ${layout.width},
        height: ${layout.height},
        backgroundColor: '${extractBackgroundColor(layout)}',
        borderRadius: ${layout.cornerRadius || 0},
        // Outros estilos extraídos do JSON
      }}
      {...props}
    >
      {children}
    </div>
  );
};
`;

  return template;
}
```

### 3. Implementação de Telas

```typescript
// apps/web/src/pages/login.tsx
import { Layout } from '@/components/layout';
import { Button } from '@petbook/ui';
import { Input } from '@petbook/ui';
import { Card } from '@petbook/ui';

export default function LoginPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Entrar no PetBook
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus pets com facilidade
            </p>
          </div>

          <form className="space-y-6">
            <Input
              type="email"
              placeholder="Email"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              required
            />
            <Button
              type="submit"
              className="w-full"
              variant="primary"
            >
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
```

## 📱 Padrões de Desenvolvimento

### 1. Responsividade

```typescript
// Baseado nos constraints do JSON
const responsiveBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1440
};

// Componente responsivo
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        'max-w-7xl', // 1440px baseado no layout
        className
      )}
    >
      {children}
    </div>
  );
};
```

### 2. Acessibilidade

```typescript
// Baseado nos elementos interativos do JSON
export const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <button
      role="button"
      tabIndex={0}
      aria-label={props['aria-label']}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 3. Estados de Loading

```typescript
// Baseado nos estados visuais do JSON
export const LoadingState: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
}> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};
```

## 🎯 Checklist de Implementação

### Para Cada Tela:

- [ ] **Analisar JSON do layout**
- [ ] **Extrair cores e tipografia**
- [ ] **Identificar componentes reutilizáveis**
- [ ] **Mapear interações e estados**
- [ ] **Implementar responsividade**
- [ ] **Adicionar acessibilidade**
- [ ] **Testar em diferentes dispositivos**
- [ ] **Validar com design system**

### Para Componentes:

- [ ] **Criar interface TypeScript**
- [ ] **Implementar variantes**
- [ ] **Adicionar props de estilo**
- [ ] **Incluir testes**
- [ ] **Documentar uso**
- [ ] **Validar acessibilidade**

## 🔧 Ferramentas Úteis

### Scripts de Automação

```bash
# Extrair cores do JSON
npm run extract-colors layouts/*.json

# Gerar componentes base
npm run generate-components layouts/*.json

# Validar design system
npm run validate-design-system

# Testar responsividade
npm run test-responsive
```

### VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag"
  ]
}
```

## 📚 Recursos Adicionais

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Design Tokens Guide](https://www.designtokens.org/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Responsive Design Patterns](https://responsivedesign.is/)

---

**PetBook Interface Implementation** - Implementação guiada por design 🎨
