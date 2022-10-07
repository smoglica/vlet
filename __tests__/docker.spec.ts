import { $ } from 'zx';
import { isDockerComposeInstalled } from '../src/docker';

jest.mock('zx', () => ({ $: jest.fn() }));

describe('docker', () => {
  describe('isDockerComposeInstalled', () => {
    it('should check if docker compose is installed', async () => {
      await isDockerComposeInstalled();

      expect($).toHaveBeenCalledWith(['docker compose version']);
    });
  });
});
