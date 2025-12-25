#!/usr/bin/env node
/**
 * scripts/seed-sample.js
 * Script utilitario para generar un fixture JSON de ejemplo en `mocks/`.
 * - Uso: `node scripts/seed-sample.js [--count N] [--out PATH] [--force]`
 * - Por defecto genera 1 reporte y escribe en `mocks/report.fixture.json`.
 */

const fs = require('fs').promises;
const { existsSync } = require('fs');
const path = require('path');

const DEFAULT_OUT = path.join(__dirname, '..', 'mocks', 'report.fixture.json');

/** Genera un objeto de reporte de ejemplo */
function createSampleReport(id) {
  return {
    id,
    title: `Reporte ejemplo #${id}`,
    description: 'Descripción de ejemplo para testing y desarrollo',
    date: new Date().toISOString(),
    location: null,
    status: 'open'
  };
}

/** Crea un array con `count` reportes de ejemplo */
function generateData(count) {
  return Array.from({ length: count }, (_, i) => createSampleReport(i + 1));
}

async function writeFixture(outputPath, data, { force = false } = {}) {
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  // Hacer backup si existe y no se fuerza overwrite
  if (!force && existsSync(outputPath)) {
    const backupPath = `${outputPath}.bak.${Date.now()}`;
    await fs.copyFile(outputPath, backupPath);
    console.log(`Backup creado: ${backupPath}`);
  }

  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf8');
}

async function main(argv) {
  const args = argv.slice(2);
  let count = 1;
  let out = DEFAULT_OUT;
  let force = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--count' && args[i + 1]) {
      count = Math.max(1, Number(args[++i]) || 1);
    } else if (a === '--out' && args[i + 1]) {
      out = path.resolve(process.cwd(), args[++i]);
    } else if (a === '--force') {
      force = true;
    } else if (a === '--help' || a === '-h') {
      console.log('Uso: node scripts/seed-sample.js [--count N] [--out PATH] [--force]');
      return;
    }
  }

  const data = generateData(count);

  try {
    await writeFixture(out, data, { force });
    console.log(`Fixture creada correctamente en: ${out}`);
    console.log(`Registros generados: ${data.length}`);
  } catch (err) {
    console.error('Error al crear fixture:', err);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main(process.argv);
}

