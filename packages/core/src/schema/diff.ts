import { diff } from 'deep-diff';

import type { ZedTheme } from '../types';

interface DiffResult {
  added: string[];
  removed: string[];
  modified: ModifiedEntry[];
}

interface ModifiedEntry {
  key: string;
  oldValue: unknown;
  newValue: unknown;
}

const CHANGE_KIND = {
  NEW: 'N',
  DELETED: 'D',
  MODIFIED: 'E',
} as const;

function generateDiff<T, U>(lhs: T, rhs: U): DiffResult {
  const diffs = diff(lhs, rhs);

  const result: DiffResult = {
    added: [],
    removed: [],
    modified: [],
  };

  if (diffs !== undefined) {
    diffs.forEach(change => {
      const path = change.path?.join('.') ?? '';

      switch (change.kind) {
        case CHANGE_KIND.NEW:
          result.added.push(path);
          break;
        case CHANGE_KIND.DELETED:
          result.removed.push(path);
          break;
        case CHANGE_KIND.MODIFIED:
          result.modified.push({
            key: path,
            oldValue: change.lhs,
            newValue: change.rhs,
          });
          break;
        default:
          throw new Error(`Unhandled change kind: ${change.kind}`);
      }
    });
  }

  return result;
}

function beautifyDiff(diffResult: DiffResult): string {
  const lines: string[] = [];

  if (diffResult.added.length > 0) {
    lines.push('## Added:');
    diffResult.added.forEach(key => {
      lines.push(`+ ${key}`);
    });
  }

  if (diffResult.removed.length > 0) {
    lines.push('## Removed:');
    diffResult.removed.forEach(key => {
      lines.push(`- ${key}`);
    });
  }

  if (diffResult.modified.length > 0) {
    lines.push('## Modified:');
    diffResult.modified.forEach(change => {
      lines.push(`~ ${change.key}:`);
      lines.push(`  - OLD: ${JSON.stringify(change.oldValue)}`);
      lines.push(`  + NEW: ${JSON.stringify(change.newValue)}`);
    });
  }

  return lines.join('\n');
}

function themeDiff(oldTheme: ZedTheme, newTheme: ZedTheme): DiffResult {
  return generateDiff(oldTheme, newTheme);
}

export { themeDiff, generateDiff, beautifyDiff, type DiffResult };
