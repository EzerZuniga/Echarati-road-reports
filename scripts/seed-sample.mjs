import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = path.join(SCRIPT_DIR, '..', 'mocks', 'report.fixture.json');

export function createSampleReport(id) {
  return {
    id,
    title: `Reporte ejemplo #${id}`,
    description: 'Descripción de ejemplo para testing y desarrollo',
    date: new Date().toISOString(),
    location: null,
    status: 'open',
  };
}

export function generateData(count) {
  return Array.from({ length: count }, (_, index) => createSampleReport(index + 1));
}

export async function writeFixture(outputPath, data, { force = false } = {}) {
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  if (!force && existsSync(outputPath)) {
    const backupPath = `${outputPath}.bak.${Date.now()}`;
    await fs.copyFile(outputPath, backupPath);
    console.log(`Backup creado: ${backupPath}`);
  }

  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf8');
}

export async function main(argv) {
  const args = argv.slice(2);
  let count = 1;
  let out = DEFAULT_OUT;
  let force = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--count' && args[i + 1]) {
      count = Math.max(1, Number(args[++i]) || 1);
    } else if (arg === '--out' && args[i + 1]) {
      out = path.resolve(process.cwd(), args[++i]);
    } else if (arg === '--force') {
      force = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Uso: node scripts/seed-sample.mjs [--count N] [--out PATH] [--force]');
      return;
    }
  }

  const data = generateData(count);

  try {
    await writeFixture(out, data, { force });
    console.log(`Fixture creada correctamente en: ${out}`);
    console.log(`Registros generados: ${data.length}`);
  } catch (error) {
    console.error('Error al crear fixture:', error);
    process.exitCode = 1;
  }
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  main(process.argv);
}
