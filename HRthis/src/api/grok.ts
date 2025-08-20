/**
 * ⚠️ SECURITY WARNING: DEPRECATED - DO NOT USE
 * 
 * This file contains insecure API key handling.
 * Use the secure backend proxy instead:
 * 
 * import { getGrokTextResponse } from './secure-grok-service';
 * 
 * @deprecated Use secure-grok-service.ts instead
 */
import OpenAI from "openai";

export const getGrokClient = (): OpenAI => {
  throw new Error(
    "SECURITY: Direct API key usage is disabled. Use secure-grok-service.ts instead."
  );
};