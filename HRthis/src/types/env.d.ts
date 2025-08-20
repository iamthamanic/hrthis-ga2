/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly REACT_APP_API_URL?: string;
    readonly REACT_APP_BASE_PATH?: string;
    readonly EXPO_PUBLIC_VIBECODE_ANTHROPIC_API_KEY?: string;
    readonly EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY?: string;
    readonly EXPO_PUBLIC_VIBECODE_GROK_API_KEY?: string;
    readonly EXPO_PUBLIC_VIBECODE_PROJECT_ID?: string;
  }
}