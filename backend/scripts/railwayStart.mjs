import { spawn } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const migrationsDir = join(rootDir, 'prisma', 'migrations');

function runCommand(command, args, cwd = rootDir) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function hasMigrations() {
  if (!existsSync(migrationsDir)) {
    return false;
  }

  const entries = readdirSync(migrationsDir, { withFileTypes: true });
  const hasMigrationFolders = entries.some((entry) => entry.isDirectory());

  return hasMigrationFolders;
}

async function main() {
  try {
    // Step 1: Generate Prisma Client
    await runCommand('npx', ['prisma', 'generate']);

    // Step 2 & 3: Check for migrations and run appropriate command
    const migrationsExist = await hasMigrations();

    if (migrationsExist) {
      console.log('Migrations directory found. Running migrate deploy...');
      await runCommand('npx', ['prisma', 'migrate', 'deploy']);
    } else {
      console.log('No migrations found. Running db push...');
      await runCommand('npx', ['prisma', 'db', 'push']);
    }

    // Step 4: Start the server
    console.log('Starting server...');
    await runCommand('node', ['dist/index.js']);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

