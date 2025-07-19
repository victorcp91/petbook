#!/bin/bash

# Script para atualizar templates de email do PetBook
# Uso: ./scripts/update-templates.sh

echo "📧 Atualizando templates de email do PetBook..."

# Verificar se o token está configurado
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN não configurado"
    echo "Configure a variável de ambiente SUPABASE_ACCESS_TOKEN"
    echo "Obtenha o token em: https://supabase.com/dashboard/account/tokens"
    exit 1
fi

# Definir o ID do projeto
export PROJECT_REF="ntvlfsuuiivbsuyneidq"

# Executar o script
node scripts/update-email-templates.js

echo "✅ Script concluído!" 