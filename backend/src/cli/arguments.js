export function parseArguments(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    const name = token.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`Opção --${name} requer um valor`);
    options[name] = value;
    i++;
  }
  return { options, positional };
}
