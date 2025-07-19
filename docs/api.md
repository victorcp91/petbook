# API Documentation - PetBook

Esta documentação descreve a API do PetBook, incluindo integração com Supabase, autenticação, e esquema do banco de dados.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Banco de Dados](#banco-de-dados)
- [Endpoints](#endpoints)
- [Tipos TypeScript](#tipos-typescript)
- [Exemplos de Uso](#exemplos-de-uso)

## 🏗️ Visão Geral

O PetBook utiliza **Supabase** como backend-as-a-service, fornecendo:

- **PostgreSQL Database** com Row Level Security (RLS)
- **Supabase Auth** para autenticação
- **Supabase Storage** para upload de arquivos
- **Supabase Realtime** para atualizações em tempo real
- **Edge Functions** para lógica serverless

### Estrutura da API

```
packages/api/
├── client.ts          # Cliente Supabase
├── auth.ts           # Utilitários de autenticação
├── types.ts          # Tipos TypeScript
├── database.ts       # Tipos do banco de dados
└── utils.ts          # Utilitários da API
```

## 🔐 Autenticação

### Configuração do Cliente

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Fluxo de Autenticação

#### 1. Login com Email/Senha

```typescript
import { signInWithPassword } from '@petbook/api';

const { data, error } = await signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (error) {
  console.error('Erro no login:', error.message);
} else {
  console.log('Usuário logado:', data.user);
}
```

#### 2. Login com Google

```typescript
import { signInWithGoogle } from '@petbook/api';

const { data, error } = await signInWithGoogle();

if (error) {
  console.error('Erro no login:', error.message);
} else {
  console.log('Login com Google realizado');
}
```

#### 3. Logout

```typescript
import { signOut } from '@petbook/api';

const { error } = await signOut();

if (error) {
  console.error('Erro no logout:', error.message);
} else {
  console.log('Logout realizado com sucesso');
}
```

### Gerenciamento de Sessão

```typescript
import { getSession, onAuthStateChange } from '@petbook/api';

// Obter sessão atual
const {
  data: { session },
} = await getSession();

// Escutar mudanças de autenticação
const {
  data: { subscription },
} = onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('Usuário logado:', session?.user);
  } else if (event === 'SIGNED_OUT') {
    console.log('Usuário deslogado');
  }
});

// Limpar listener
subscription.unsubscribe();
```

## 🗄️ Banco de Dados

### Esquema Principal

#### Tabela: `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

#### Tabela: `pets`

```sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  weight DECIMAL(5,2),
  color TEXT,
  microchip TEXT,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Proprietários podem ver seus pets
CREATE POLICY "Owners can view their pets" ON pets
  FOR SELECT USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'groomer', 'attendant')
    )
  );

-- Proprietários podem gerenciar seus pets
CREATE POLICY "Owners can manage their pets" ON pets
  FOR ALL USING (auth.uid() = owner_id);
```

#### Tabela: `appointments`

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  groomer_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver agendamentos relacionados
CREATE POLICY "Users can view related appointments" ON appointments
  FOR SELECT USING (
    auth.uid() = owner_id OR
    auth.uid() = groomer_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'attendant')
    )
  );
```

### Tipos TypeScript

```typescript
// packages/api/database.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'groomer' | 'attendant' | 'client';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'groomer' | 'attendant' | 'client';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'admin' | 'groomer' | 'attendant' | 'client';
          created_at?: string;
          updated_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          species: string;
          breed: string | null;
          birth_date: string | null;
          weight: number | null;
          color: string | null;
          microchip: string | null;
          photo_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          species: string;
          breed?: string | null;
          birth_date?: string | null;
          weight?: number | null;
          color?: string | null;
          microchip?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          birth_date?: string | null;
          weight?: number | null;
          color?: string | null;
          microchip?: string | null;
          photo_url?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          pet_id: string;
          owner_id: string;
          groomer_id: string | null;
          service_type: string;
          appointment_date: string;
          duration_minutes: number;
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          price: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          owner_id: string;
          groomer_id?: string | null;
          service_type: string;
          appointment_date: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          owner_id?: string;
          groomer_id?: string | null;
          service_type?: string;
          appointment_date?: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
```

## 🔗 Endpoints

### Usuários

#### GET /api/users/profile

Obter perfil do usuário atual.

```typescript
import { getUserProfile } from '@petbook/api';

const { data: profile, error } = await getUserProfile();
```

#### PUT /api/users/profile

Atualizar perfil do usuário.

```typescript
import { updateUserProfile } from '@petbook/api';

const { data, error } = await updateUserProfile({
  full_name: 'João Silva',
  avatar_url: 'https://example.com/avatar.jpg',
});
```

### Pets

#### GET /api/pets

Listar pets do usuário.

```typescript
import { getPets } from '@petbook/api';

const { data: pets, error } = await getPets();
```

#### POST /api/pets

Criar novo pet.

```typescript
import { createPet } from '@petbook/api';

const { data: pet, error } = await createPet({
  name: 'Rex',
  species: 'dog',
  breed: 'Golden Retriever',
  birth_date: '2020-01-15',
  weight: 25.5,
  color: 'Dourado',
  notes: 'Pet muito dócil',
});
```

#### GET /api/pets/:id

Obter detalhes de um pet.

```typescript
import { getPet } from '@petbook/api';

const { data: pet, error } = await getPet('pet-id');
```

#### PUT /api/pets/:id

Atualizar pet.

```typescript
import { updatePet } from '@petbook/api';

const { data: pet, error } = await updatePet('pet-id', {
  weight: 26.0,
  notes: 'Pet ganhou peso',
});
```

#### DELETE /api/pets/:id

Remover pet.

```typescript
import { deletePet } from '@petbook/api';

const { error } = await deletePet('pet-id');
```

### Agendamentos

#### GET /api/appointments

Listar agendamentos.

```typescript
import { getAppointments } from '@petbook/api';

const { data: appointments, error } = await getAppointments({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  status: 'scheduled',
});
```

#### POST /api/appointments

Criar novo agendamento.

```typescript
import { createAppointment } from '@petbook/api';

const { data: appointment, error } = await createAppointment({
  pet_id: 'pet-id',
  service_type: 'banho_tosa',
  appointment_date: '2024-01-15T10:00:00Z',
  duration_minutes: 90,
  notes: 'Primeira vez no pet shop',
});
```

#### PUT /api/appointments/:id

Atualizar agendamento.

```typescript
import { updateAppointment } from '@petbook/api';

const { data: appointment, error } = await updateAppointment('appointment-id', {
  status: 'completed',
  notes: 'Serviço realizado com sucesso',
});
```

## 📊 Exemplos de Uso

### Hook para Gerenciar Pets

```typescript
// hooks/usePets.ts
import { useState, useEffect } from 'react';
import { getPets, createPet, updatePet, deletePet } from '@petbook/api';

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPets();

      if (error) throw error;
      setPets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async petData => {
    try {
      const { data, error } = await createPet(petData);
      if (error) throw error;

      setPets(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editPet = async (id, petData) => {
    try {
      const { data, error } = await updatePet(id, petData);
      if (error) throw error;

      setPets(prev => prev.map(pet => (pet.id === id ? data : pet)));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removePet = async id => {
    try {
      const { error } = await deletePet(id);
      if (error) throw error;

      setPets(prev => prev.filter(pet => pet.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    loading,
    error,
    addPet,
    editPet,
    removePet,
    refetch: fetchPets,
  };
};
```

### Componente de Upload de Imagem

```typescript
// components/ImageUpload.tsx
import { useState } from 'react';
import { uploadImage } from '@petbook/api';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder: string;
}

export const ImageUpload = ({ onUpload, folder }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const { data, error } = await uploadImage(file, folder);

      if (error) throw error;

      onUpload(data.url);
    } catch (error) {
      console.error('Erro no upload:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      {uploading && <span>Fazendo upload...</span>}
    </div>
  );
};
```

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas têm RLS habilitado com políticas específicas:

- **Usuários**: Podem ver/editar apenas seus próprios dados
- **Pets**: Proprietários podem gerenciar seus pets, staff pode visualizar
- **Agendamentos**: Usuários relacionados podem visualizar/gerenciar

### Validação de Dados

```typescript
// packages/api/validation.ts
import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  species: z.enum(['dog', 'cat', 'bird', 'other']),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  weight: z.number().positive().optional(),
  color: z.string().optional(),
  microchip: z.string().optional(),
  notes: z.string().optional(),
});

export const createAppointmentSchema = z.object({
  pet_id: z.string().uuid(),
  service_type: z.enum(['banho', 'tosa', 'banho_tosa', 'outro']),
  appointment_date: z.string().datetime(),
  duration_minutes: z.number().min(15).max(480),
  notes: z.string().optional(),
});
```

## 📈 Monitoramento

### Logs de Erro

```typescript
// packages/api/logger.ts
export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'API'}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};
```

### Métricas de Performance

```typescript
// packages/api/metrics.ts
export const trackApiCall = (endpoint: string, duration: number) => {
  // Integração com sistema de métricas
  console.log(`API Call: ${endpoint} took ${duration}ms`);
};
```

---

**PetBook API** - Documentação completa da API 🚀
