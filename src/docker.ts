import { $ } from 'zx';

export const isDockerComposeInstalled = async (): Promise<boolean> => {
  try {
    await $`docker compose version`.quiet();

    return true;
  } catch {
    return false;
  }
};

export const isDockerRunning = async (): Promise<boolean> => {
  try {
    await $`docker info`.quiet();

    return true;
  } catch {
    return false;
  }
};

export const isDockerServiceRunning = async (
  serviceName: string
): Promise<boolean> => {
  try {
    await $`docker compose ps ${serviceName} -q`.quiet();

    return true;
  } catch {
    return false;
  }
};
