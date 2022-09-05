#!/usr/bin/env node

import { chalk, echo } from 'zx';
import {
  isDockerComposeInstalled,
  isDockerRunning,
  isDockerServiceRunning,
} from './docker.js';

const main = async () => {
  const VLET_APP_SERVICE = process.env.VLET_APP_SERVICE || 'app';

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

  if (!(await isDockerServiceRunning(VLET_APP_SERVICE))) {
    echo(
      chalk.red(
        `Docker Compose service name \`${VLET_APP_SERVICE}\` isn't running.
        \nYou may run \`vlet up -d\` or \`npx vlet up -d\`.`
      )
    );
  }
};

main();
