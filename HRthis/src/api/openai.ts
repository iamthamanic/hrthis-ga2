/**
 * ⚠️ SECURITY WARNING: DEPRECATED - DO NOT USE
 * 
 * This file contains insecure API key handling.
 * Use the secure backend proxy instead:
 * 
 * import { getOpenAITextResponse } from './secure-openai-service';
 * 
 * @deprecated Use secure-openai-service.ts instead
 */

import OpenAI from "openai";

export const getOpenAIClient = (): OpenAI => {
  throw new Error(
    "SECURITY: Direct API key usage is disabled. Use secure-openai-service.ts instead."
  );
};