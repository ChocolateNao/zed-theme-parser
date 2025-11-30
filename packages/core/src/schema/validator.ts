import Ajv, { type SchemaObject } from 'ajv';
import addFormats from 'ajv-formats';

import type { ZedTheme } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class SchemaValidator {
  private readonly ajv: Ajv;
  private readonly schemas = new Map<string, SchemaObject>();

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
    });
    addFormats(this.ajv);
  }

  async addSchema(schemaOrUrl: SchemaObject | string, key?: string): Promise<void> {
    try {
      let schemaObj: SchemaObject = {};

      if (typeof schemaOrUrl === 'string') {
        const response = await fetch(schemaOrUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }

        schemaObj = await response.json() as SchemaObject;
      } else {
        schemaObj = schemaOrUrl;
      }

      const schemaKey = key ?? schemaObj.$id ?? `schema-${Date.now().toLocaleString()}`;
      this.ajv.addSchema(schemaObj, schemaKey);
      this.schemas.set(schemaKey, schemaObj);
    } catch (error) {
      throw new Error(
        `Failed to add schema: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { cause: error }
      );
    }
  }

  validate(theme: ZedTheme, schemaKey?: string): ValidationResult {
    const validator = schemaKey
      ? this.ajv.getSchema(schemaKey)
      : this.ajv.getSchema(Object.keys(this.schemas)[0]);

    if (validator == null) {
      throw new Error('No schema available for validation');
    }

    const valid = validator(theme);

    return {
      valid,
      errors: validator.errors
        ? validator.errors.map(err => `${err.instancePath} ${err.message ?? 'unexpected error'}`)
        : [],
      warnings: [],
    };
  }

  getAvailableSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }

  getSchema(key: string): SchemaObject | undefined {
    return this.schemas.get(key);
  }
}
