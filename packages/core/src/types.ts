type Nullable<T> = T | undefined | null;

export interface ZedTheme {
  $schema: string;
  name: string;
  author: string;
  themes: Theme[];
}

export interface Theme {
  name: string;
  appearance: 'light' | 'dark';
  style: ThemeStyle;
}

export interface ThemeStyle {
  players: PlayerStyle;
  syntax: SyntaxStyle;
  accents?: Nullable<string[]>;
  [key: string]: unknown;
}

export type PlayerStyle = Record<
  string,
  {
    cursor?: Nullable<string>;
    background?: Nullable<string>;
    selection?: Nullable<string>;
  }
>;

export type SyntaxStyle = Record<
  string,
  {
    background_color?: Nullable<string>;
    color?: Nullable<string>;
    font_style?: Nullable<'normal' | 'italic' | 'oblique'>;
    font_weight?: Nullable<number>;
  }
>;

export interface ItalicizeConfig {
  /** Whether to preserve existing font styles */
  preserveExisting?: boolean;
  /** Specific token types to italicize (if not provided, all applicable tokens will be italicized) */
  includeTokens?: string[];
  /** Token types to exclude from italicization */
  excludeTokens?: string[];
}

export interface PublishConfig {
  /** Output directory for the theme file */
  outputDir?: string;
  /** Whether to create a backup of the original theme */
  createBackup?: boolean;
}
