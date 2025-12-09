import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { logger } from './logger';

function readJsonFile<T>(filePath: string): T {
  try {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    const json: T = JSON.parse(content);
    return json;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file: ${filePath}`, { cause: error });
    }
    throw error;
  }
}

function writeJsonFile(filePath: string, data: unknown, pretty = true): void {
  try {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

    writeFileSync(filePath, content, 'utf-8');
    logger.debug(`File written: ${filePath}`);
  } catch (error) {
    throw new Error(`Failed to write file: ${filePath}`, { cause: error });
  }
}

function backupFile(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`Cannot backup non-existent file: ${filePath}`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup.${timestamp}`;

  copyFileSync(filePath, backupPath);
  logger.info(`Backup created: ${backupPath}`);

  return backupPath;
}

function ensureFileExtension(filePath: string, extension = '.json'): string {
  if (!filePath.toLowerCase().endsWith(extension.toLowerCase())) {
    return `${filePath}${extension}`;
  }
  return filePath;
}

function readFileAsString(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return readFileSync(filePath, 'utf-8');
}

function writeFile(filePath: string, content: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, content, 'utf-8');
}

export {
  readJsonFile,
  writeJsonFile,
  backupFile,
  ensureFileExtension,
  readFileAsString,
  writeFile,
};
