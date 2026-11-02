import readline from 'node:readline';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../config/constants.js';

function ask(question) {
  return new Promise((resolve) => {
    const interactive = Boolean(process.stdin.isTTY);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: interactive });
    if (interactive) {
      rl._writeToOutput = (text) => {
        if (text.includes(question)) process.stdout.write(text);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (interactive) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

export async function resolvePassword(options, { confirm = false } = {}) {
  let password = options.senha;
  if (password === undefined) {
    password = await ask('Senha: ');
    if (confirm && process.stdin.isTTY && (await ask('Confirme a senha: ')) !== password) {
      throw new Error('As senhas não conferem');
    }
  }
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`A senha deve ter entre ${MIN_PASSWORD_LENGTH} e ${MAX_PASSWORD_LENGTH} caracteres`);
  }
  return password;
}
