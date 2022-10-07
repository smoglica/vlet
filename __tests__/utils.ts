import { fs, echo, path, chalk } from 'zx';
import { parse } from 'dotenv';
import {
  isKnownCommand,
  getKnownCommands,
  DEFAULT_EXEC_COMMANDS,
  shift,
  setUserIdAndGroupIdInDotEnvFile,
} from '../src/utils';

jest.mock('dotenv', () => ({ parse: jest.fn() }));
jest.mock('zx', () => ({
  echo: jest.fn(val => val),
  chalk: {
    yellow: jest.fn(val => val),
  },
  fs: {
    pathExists: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    access: jest.fn(),
    constants: {
      R_OK: 4,
      W_OK: 2,
    },
  },
  path: {
    join: jest.fn((...args) => args.join('/')),
  },
  os: {
    userInfo: jest.fn(() => ({ uid: 1000, gid: 1000 })),
  },
}));

describe('utils', () => {
  describe('getKnownCommands', () => {
    it('should retrun a list of default commands', () => {
      expect(getKnownCommands()).toEqual(DEFAULT_EXEC_COMMANDS);
    });

    it('should return additional known commands with the default ones', () => {
      process.env.VLET_EXEC_COMMANDS =
        'mysql,mysql, mariadb,php,,,yarn,php,bash,,';

      const result = getKnownCommands();

      expect(result).toContain('mysql');
      expect(result).toContain('mariadb');
      expect(result).toContain('php');
      expect(result).toEqual([
        ...DEFAULT_EXEC_COMMANDS,
        'mysql',
        'mariadb',
        'php',
      ]);
    });
  });

  describe('isKnownCommand', () => {
    it('should return `false` when unknown command', () => {
      expect(isKnownCommand('unknown')).toBe(false);
    });

    test.each(DEFAULT_EXEC_COMMANDS)(
      'should return `true` when `%s` as command',
      command => {
        expect(isKnownCommand(command)).toBe(true);
      }
    );
  });

  describe('shift', () => {
    it('should retrun a shifted value', () => {
      expect(shift(['foo', 'bar'], 1)).toEqual(['bar']);
      expect(shift(['foo', 'bar'], 3)).toEqual([]);
    });
  });

  describe('setUserIdAndGroupIdInDotEnvFile', () => {
    beforeEach(() => {
      jest.spyOn(process, 'cwd').mockImplementation(() => '/cwd');
    });

    it("should show a message when path doesn't exist", async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(false);

      await setUserIdAndGroupIdInDotEnvFile();

      expect(path.join).toHaveBeenCalledWith('/cwd', '.env');
      expect(fs.pathExists).toHaveBeenCalledWith('/cwd/.env');
      expect(echo).toHaveBeenCalledWith('File in path `/cwd/.env` not found.');
      expect(chalk.yellow).toHaveBeenCalledWith(
        'File in path `/cwd/.env` not found.'
      );
    });

    it('should show a message when not enough permissions', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.access as jest.Mock).mockResolvedValue(false);

      await setUserIdAndGroupIdInDotEnvFile();
      expect(echo).toHaveBeenCalledWith(
        'Not enough permissions to read or write in `/cwd/.env`.'
      );
      expect(chalk.yellow).toHaveBeenCalledWith(
        'Not enough permissions to read or write in `/cwd/.env`.'
      );
      expect(fs.access).toHaveBeenCalledWith('/cwd/.env', 6);
    });

    it('should update the desired dot env file', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.access as jest.Mock).mockResolvedValue(undefined);
      (parse as jest.Mock).mockReturnValue({
        VLET_USER_ID: 1,
        VLET_EXEC_COMMANDS: 'mysql',
        VLET_GROUP_ID: 2,
      });

      await setUserIdAndGroupIdInDotEnvFile();

      expect(fs.readFile).toHaveBeenCalledWith('/cwd/.env', {
        encoding: 'utf-8',
      });
      expect(fs.writeFile).toHaveBeenCalledWith(
        '/cwd/.env',
        `VLET_USER_ID=1000
VLET_EXEC_COMMANDS=mysql
VLET_GROUP_ID=1000
`
      );
    });
  });
});
