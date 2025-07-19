export const emailTemplates = {
  confirmation: {
    subject: 'Confirme sua conta PetBook',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">PetBook</h1>
          <p style="color: #6B7280; margin: 10px 0 0 0;">Sistema de gestão para pet shops</p>
        </div>
        
        <div style="background-color: #F8FAFC; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin: 0 0 20px 0; text-align: center;">Confirme sua conta</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            Olá! Você acabou de criar uma conta no PetBook. Para começar a usar o sistema, 
            confirme seu email clicando no botão abaixo:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block; 
                      font-weight: 600; font-size: 16px;">
              Confirmar Email
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="color: #3B82F6; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0;">
            {{ .ConfirmationURL }}
          </p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0;">
            Este link expira em 24 horas. Se você não criou uma conta no PetBook, 
            pode ignorar este email com segurança.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            © 2024 PetBook. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
  },

  recovery: {
    subject: 'Redefinir senha PetBook',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">PetBook</h1>
          <p style="color: #6B7280; margin: 10px 0 0 0;">Sistema de gestão para pet shops</p>
        </div>
        
        <div style="background-color: #F8FAFC; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin: 0 0 20px 0; text-align: center;">Redefinir senha</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            Você solicitou a redefinição da sua senha no PetBook. Clique no botão abaixo 
            para criar uma nova senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block; 
                      font-weight: 600; font-size: 16px;">
              Redefinir Senha
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="color: #3B82F6; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0;">
            {{ .ConfirmationURL }}
          </p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0;">
            Este link expira em 1 hora. Se você não solicitou a redefinição da senha, 
            pode ignorar este email com segurança.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            © 2024 PetBook. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
  },

  magicLink: {
    subject: 'Seu link mágico PetBook',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #3B82F6; margin: 0;">PetBook</h1>
          <p style="color: #6B7280; margin: 10px 0 0 0;">Sistema de gestão para pet shops</p>
        </div>
        
        <div style="background-color: #F8FAFC; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h2 style="color: #1F2937; margin: 0 0 20px 0; text-align: center;">Acesse sua conta</h2>
          
          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            Clique no botão abaixo para fazer login no PetBook sem precisar de senha:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" 
               style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; display: inline-block; 
                      font-weight: 600; font-size: 16px;">
              Fazer Login
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; text-align: center; margin: 20px 0 0 0;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="color: #3B82F6; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0;">
            {{ .ConfirmationURL }}
          </p>
        </div>
        
        <div style="text-align: center; color: #6B7280; font-size: 14px;">
          <p style="margin: 0;">
            Este link expira em 1 hora. Se você não solicitou este login, 
            pode ignorar este email com segurança.
          </p>
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            © 2024 PetBook. Todos os direitos reservados.
          </p>
        </div>
      </div>
    `,
  },
};
