#!/usr/bin/env node

import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import cli from './cli.js';

expand(config());

cli();
