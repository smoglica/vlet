# Vlet

> A light-weight command-line interface for interacting with Docker Compose services

## Requirements

- Node version >= 16.0.0
- [Docker Compose V2](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command) installed as `docker compose` command and not `docker-compose`

## Description

Vlet is a tool that should be used only for development purposes. It helps to run docker services and executing commands inside a specific docker container service.

Every unknown commands passed to `vlet` will be passed automatically to the `docker compose` binary.

Known commands are by default: `node`, `npm`, `npx`, `yarn`, `bash` and `sh`. You can extend them by providing in your `.env` file a `VLET_EXEC_COMMANDS` which could contain as value a string of commands separated by comma e.g `VLET_EXEC_COMMANDS=php,mysql`

## Options

| Name      | Description                               |
| --------- | ----------------------------------------- |
| --service | Service name where to execute the command |

## Usage

```bash
# Docker compose commands
npx vlet up
npx vlet up -d
npx vlet stop
npx vlet down
npx vlet ps

# NPM commands
npx vlet npm             # Run a `npm` command
npx vlet npx             # Run a `npx` command

# Yarn commands
npx vlet yarn            # Run a `yarn` command

# Container CLI
npx vlet bash            # Run a shell session with `bash` within the container
npx vlet sh              # Run a shell session with `sh` within the container
npx vlet bash [COMMAND]  # Run a `bash` command within the container
npx vlet sh [COMMAND]    # Run a `sh` command within the container
```

## Development

```bash
# Starts script compilation in watch mode
npm run dev

# Execute program
npm run vlet -- [options] [COMMAND] [ARGS...]
```
