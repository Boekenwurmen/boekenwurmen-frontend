// This setup file loads the .env.test file for Vitest test runs
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.test' });
