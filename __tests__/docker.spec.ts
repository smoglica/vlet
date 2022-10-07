import { $ } from 'zx';
import {
  isDockerComposeInstalled,
  isDockerRunning,
  isDockerServiceRunning,
} from '../src/docker';

jest.mock('zx', () => ({ $: jest.fn() }));

describe('docker', () => {
  const quiet = jest.fn();

  beforeEach(() => {
    ($ as unknown as jest.Mock).mockReturnValue({ quiet });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('isDockerComposeInstalled', () => {
    it('should return `true` when docker compose installed', async () => {
      const result = await isDockerComposeInstalled();

      expect(result).toBe(true);
      expect($).toHaveBeenCalledWith(['docker compose version']);
      expect(quiet).toHaveBeenCalled();
    });

    it('should return `false` when docker compose is not installed', async () => {
      quiet.mockRejectedValue(new Error('command not found: docker compose'));

      ($ as unknown as jest.Mock).mockReturnValue({ quiet });

      const result = await isDockerComposeInstalled();

      expect(result).toBe(false);
    });
  });

  describe('isDockerRunning', () => {
    it('should return `true` when docker is running', async () => {
      const result = await isDockerRunning();

      expect(result).toBe(true);
      expect($).toHaveBeenCalledWith(['docker info']);
      expect(quiet).toHaveBeenCalled();
    });

    it('should return `false` when docker is not running', async () => {
      quiet.mockRejectedValue(
        new Error('ERROR: Cannot connect to the Docker daemon')
      );

      const result = await isDockerRunning();

      expect(result).toBe(false);
    });
  });

  describe('isDockerServiceRunning', () => {
    it('should return `true` when a docker compose service is running', async () => {
      const result = await isDockerServiceRunning('app');

      expect($).toHaveBeenCalledWith(['docker compose ps ', ' -q'], 'app');
      expect(result).toBe(true);
    });

    it('should return `false` when a docker compose service is not running', async () => {
      quiet.mockRejectedValue(new Error('no such service: app'));

      const result = await isDockerServiceRunning('app');

      expect(result).toBe(false);
    });
  });
});
