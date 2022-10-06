#!/usr/bin/env node

import { chalk, echo, $ } from 'zx';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import {
  isDockerComposeInstalled,
  isDockerRunning,
  isDockerServiceRunning,
} from './docker.js';
import { isKnownCommand, shift } from './utils.js';

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

  const args = process.argv.slice(2);
  const command = args[0] || '';

  if (!command) {
    return;
  }

  const COMPOSE_FILE = process.env.COMPOSE_FILE || 'docker-compose.yaml';

  if (!isKnownCommand(command)) {
    await $`docker compose -f ${COMPOSE_FILE} ${args}`.nothrow();

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

  switch (command) {
    case 'sh':
    case 'bash': {
      const commands = shift(args, 1);

      if (!commands.length) {
        return;
      }

      await $`docker compose -f ${COMPOSE_FILE} exec ${VLET_APP_SERVICE} ${command} -c "${commands}"`.nothrow();

      break;
    }
    case 'shell':
      await $`docker compose -f ${COMPOSE_FILE} exec ${VLET_APP_SERVICE} sh`.nothrow();

      break;
    default:
      await $`docker compose -f ${COMPOSE_FILE} exec ${VLET_APP_SERVICE} ${args}`.nothrow();

      break;
  }
})();
