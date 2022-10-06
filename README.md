# Vlet

> A light-weight command-line interface for interacting with Docker Compose services

## Requirements

- Node version >= 16.0.0
- [Docker Compose V2](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command) installed as `docker compose` command
- Bash

## Development

```bash
# Starts script compilation in watch mode
npm run dev

# Execute program
npm run vlet -- <command>
```

## Usage

```bash
# Docker compose commands
npx vlet up
npx vlet up -d
npx vlet stop
npx vlet down
npx vlet ps

# NPM commands
npx vlet npm   # Run a `npm` command
npx vlet npx   # Run a `npx` command

# Yarn commands
npx vlet yarn  # Run a `yarn` command

# Container CLI
npx vlet bash            # Run a shell session with `bash` within the application container
npx vlet sh              # Run a shell session with `sh` within the application container
npx vlet bash [COMMAND]  # Run a `bash` command within the application container
npx vlet sh [COMMAND]    # Run a `sh` command within the application container
```
