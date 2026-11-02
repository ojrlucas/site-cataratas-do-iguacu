import { conflict, unauthorized } from '../shared/http-error.js';
import { serializeUsuario } from '../serializers/usuario.js';
import { hashPassword, verifyPassword } from './passwords.js';

export function createAuthService({ usuarios, tokens }) {
  const session = (usuario) => ({ token: tokens.sign(usuario), usuario: serializeUsuario(usuario) });

  return {
    register({ nome, email, telefone, senha }) {
      if (usuarios.findByEmail(email)) {
        throw conflict('Já existe uma conta com este e-mail', { email: 'E-mail já cadastrado' });
      }
      return session(usuarios.insert({ nome, email, telefone, senhaHash: hashPassword(senha) }));
    },

    login({ email, senha }) {
      const usuario = usuarios.findByEmail(email);
      if (!verifyPassword(senha, usuario?.senha_hash)) throw unauthorized('E-mail ou senha incorretos');
      return session(usuario);
    },

    requestPasswordReset() {
      return { mensagem: 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.' };
    },

    authenticate(token) {
      let userId;
      try {
        userId = tokens.verify(token);
      } catch {
        throw unauthorized('Sessão inválida ou expirada. Faça login novamente.');
      }
      const usuario = usuarios.findById(userId);
      if (!usuario) throw unauthorized('Sessão inválida ou expirada. Faça login novamente.');
      return usuario;
    },
  };
}
