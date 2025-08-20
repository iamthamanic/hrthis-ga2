/**
 * ⚠️ SECURITY WARNING: DEPRECATED - DO NOT USE
 * 
 * This file contains insecure API key handling.
 * Use the secure backend proxy instead:
 * 
 * import { getAnthropicTextResponse } from './secure-anthropic-service';
 * 
 * @deprecated Use secure-anthropic-service.ts instead
 */
import Anthropic from "@anthropic-ai/sdk";

import { logSecurityWarning } from './security-warning';

export const getAnthropicClient = (): Anthropic => {
  logSecurityWarning('Anthropic');
  throw new Error(
    "SECURITY: Direct API key usage is disabled. Use secure-anthropic-service.ts instead."
  );
};