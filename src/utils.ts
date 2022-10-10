import { os, fs, path, chalk, echo } from 'zx';
import { parse } from 'dotenv';

export const DEFAULT_EXEC_COMMANDS = [
  'node',
  'npm',
  'npx',
  'yarn',
  'bash',
  'sh',
];

export const getKnownCommands = () => [
  ...new Set([
    ...DEFAULT_EXEC_COMMANDS,
    ...(process.env.VLET_EXEC_COMMANDS?.trim()
      ?.split(',')
      .map(cmd => cmd.trim().toLowerCase())
      .filter(cmd => cmd) || []),
  ]),
];

export const isKnownCommand = (command: string): boolean =>
  getKnownCommands().includes(command);

export const shift = (args: string[], n: number) => args.slice(n);

export const setUserIdAndGroupIdInDotEnvFile = async (
  pathToEnvFile = path.join(process.cwd(), '.env')
) => {
  const pathExists = await fs.pathExists(pathToEnvFile);

  if (!pathExists) {
    echo(chalk.yellow(`File in path \`${pathToEnvFile}\` not found.`));

    return;
  }

  const access = await fs.access(
    pathToEnvFile,
    fs.constants.R_OK | fs.constants.W_OK // eslint-disable-line no-bitwise
  );

  if (access !== undefined) {
    echo(
      chalk.yellow(
        `Not enough permissions to read or write in \`${pathToEnvFile}\`.`
      )
    );

    return;
  }

  const userInfo = os.userInfo();
  const userId = userInfo.uid.toString();
  const groupId = userInfo.gid.toString();
  const dotEnvFileContent = await fs.readFile(pathToEnvFile, {
    encoding: 'utf-8',
  });

  const parsedDotEnvFile = parse(dotEnvFileContent);

  parsedDotEnvFile.VLET_USER_ID = userId;
  parsedDotEnvFile.VLET_GROUP_ID = groupId;

  const contentToWrite = Object.entries(parsedDotEnvFile).reduce(
    (acc, [key, value]) => `${acc}${key}=${value}\n`,
    ''
  );

  await fs.writeFile(pathToEnvFile, contentToWrite);
};
