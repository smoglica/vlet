export const DEFAULT_EXEC_COMMANDS = ['node', 'npm', 'yarn', 'shell', 'bash'];

export const isKnownCommand = (command: string): boolean =>
  [
    ...new Set([
      ...(process.env.VLET_EXEC_COMMANDS?.trim()
        ?.split(',')
        .map(cmd => cmd.trim().toLowerCase())
        .filter(cmd => cmd) || []),
      ...DEFAULT_EXEC_COMMANDS,
    ]),
  ].includes(command);
