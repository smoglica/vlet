#!/usr/bin/env node

import { chalk, echo, $, argv } from 'zx';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import {
  isDockerComposeInstalled,
  isDockerRunning,
  isDockerServiceRunning,
} from './docker.js';
import {
  isKnownCommand,
  setUserIdAndGroupIdInDotEnvFile,
  shift,
} from './utils.js';

expand(config());

(async () => {
  if (!(await isDockerRunning())) {
    echo(chalk.red('Docker service is not running.'));

    return;
  }

  if (!(await isDockerComposeInstalled())) {
    echo(
      chalk.red('Docker Compose command not found. Install Docker Compose.')
    );

    return;
  }

  const args = shift(process.argv, 2);
  const parsedArgs = argv._ || [];
  const command = parsedArgs[0] || '';

  if (!command) {
    return;
  }

  if (!isKnownCommand(command)) {
    if (parsedArgs.includes('up')) {
      await setUserIdAndGroupIdInDotEnvFile(argv['env-file']);
    }

    await $`docker compose ${args}`.nothrow();

    return;
  }

  const VLET_APP_SERVICE = process.env.VLET_APP_SERVICE || 'app';

  if (!(await isDockerServiceRunning(VLET_APP_SERVICE))) {
    echo(
      chalk.red(
        `Docker Compose service name \`${VLET_APP_SERVICE}\` isn't running.
          \nYou may run \`vlet up -d\` or \`npx vlet up -d\`.`
      )
    );

    return;
  }

  const baseDockerComposeCommand = [
    'docker',
    'compose',
    'exec',
    VLET_APP_SERVICE,
  ];

  switch (command) {
    case 'sh':
    case 'bash': {
      const commands = shift(args, 1);

      if (!commands.length) {
        return;
      }

      await $`${baseDockerComposeCommand} ${command} -c "${commands}"`.nothrow();

      break;
    }
    case 'shell':
      await $`${baseDockerComposeCommand} sh`.nothrow();

      break;
    default:
      await $`${baseDockerComposeCommand} ${args}`.nothrow();

      break;
  }
})();
