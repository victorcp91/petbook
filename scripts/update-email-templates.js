#!/usr/bin/env node

/**
 * Script para atualizar os templates de email do Supabase
 *
 * Uso:
 * 1. Configure as variáveis de ambiente:
 *    - SUPABASE_ACCESS_TOKEN (obtenha em https://supabase.com/dashboard/account/tokens)
 *    - PROJECT_REF (ID do projeto, ex: ntvlfsuuiivbsuyneidq)
 *
 * 2. Execute: node scripts/update-email-templates.js
 */

const { emailTemplates } = require('../apps/web/src/lib/email-templates.ts');

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = process.env.PROJECT_REF || 'ntvlfsuuiivbsuyneidq';

if (!SUPABASE_ACCESS_TOKEN) {
  console.error('❌ SUPABASE_ACCESS_TOKEN não configurado');
  console.log(
    'Obtenha o token em: https://supabase.com/dashboard/account/tokens'
  );
  process.exit(1);
}

async function updateEmailTemplates() {
  try {
    console.log('📧 Atualizando templates de email do PetBook...');

    const templates = {
      mailer_subjects_confirmation: emailTemplates.confirmation.subject,
      mailer_templates_confirmation_content:
        emailTemplates.confirmation.content,
      mailer_subjects_recovery: emailTemplates.recovery.subject,
      mailer_templates_recovery_content: emailTemplates.recovery.content,
      mailer_subjects_magic_link: emailTemplates.magicLink.subject,
      mailer_templates_magic_link_content: emailTemplates.magicLink.content,
    };

    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templates),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Erro ao atualizar templates: ${response.status} ${error}`
      );
    }

    console.log('✅ Templates de email atualizados com sucesso!');
    console.log('📋 Templates aplicados:');
    console.log('  - Confirmação de conta');
    console.log('  - Redefinição de senha');
    console.log('  - Link mágico');
  } catch (error) {
    console.error('❌ Erro ao atualizar templates:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateEmailTemplates();
}

module.exports = { updateEmailTemplates };
