/**
 * Fail Loudly Mechanismen
 * 
 * Dieses System implementiert sichtbare Fehlerbehandlung und Blockierungen,
 * die sicherstellen, dass KI-Agenten bei Fehlern oder fehlenden Schritten
 * sofort gestoppt werden und nicht still fehlschlagen können.
 */

import { PipelineErrorHandler } from './types';

/**
 * Fail Loudly Manager
 */
export class FailLoudlyManager {
  private errorHandlers: PipelineErrorHandler[] = [];
  private isEnabled: boolean = true;
  private errorLog: Array<{ timestamp: Date; type: string; message: string; details?: any }> = [];
  private blockedOperations: Set<string> = new Set();

  constructor(enabled: boolean = true) {
    this.isEnabled = enabled;
    this.setupGlobalErrorHandling();
  }

  /**
   * Registriert einen Error Handler
   */
  addErrorHandler(handler: PipelineErrorHandler): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Sichtbarer Fehler mit sofortigem Stop
   * @RequiredStep: "throw-loud-error"
   */
  throwLoudError(
    message: string, 
    errorType: 'STEP_FAILED' | 'MISSING_STEP' | 'CHECKPOINT_FAILED' | 'VALIDATION_FAILED' | 'SYSTEM_ERROR' = 'SYSTEM_ERROR',
    details?: any
  ): never {
    const errorEntry = {
      timestamp: new Date(),
      type: errorType,
      message,
      details
    };

    this.errorLog.push(errorEntry);

    if (this.isEnabled) {
      // Visuell auffällige Fehlerausgabe
      console.error('\n' + '🚨'.repeat(20));
      console.error('🚨 PIPELINE FAILURE - OPERATION BLOCKED 🚨');
      console.error('🚨'.repeat(20));
      console.error(`\n💥 ERROR TYPE: ${errorType}`);
      console.error(`💥 MESSAGE: ${message}`);
      
      if (details) {
        console.error(`💥 DETAILS:`, details);
      }
      
      console.error(`💥 TIMESTAMP: ${errorEntry.timestamp.toISOString()}`);
      console.error(`💥 ERROR ID: ${this.generateErrorId()}`);
      
      // Zeige Stack Trace falls verfügbar
      const stack = new Error().stack;
      if (stack) {
        console.error(`💥 STACK TRACE:\n${stack}`);
      }
      
      console.error('\n' + '🚨'.repeat(20));
      console.error('🚨 SYSTEM HALTED - FIX ERRORS TO CONTINUE 🚨');
      console.error('🚨'.repeat(20) + '\n');
    }

    // Rufe registrierte Error Handler auf
    this.triggerErrorHandlers(errorType, message, details);

    // Blockiere weitere Operationen
    this.blockAllOperations();

    throw new Error(`[${errorType}] ${message}`);
  }

  /**
   * Warnung mit sichtbarer Ausgabe (nicht blockierend)
   * @RequiredStep: "show-loud-warning"
   */
  showLoudWarning(message: string, details?: any): void {
    const warningEntry = {
      timestamp: new Date(),
      type: 'WARNING',
      message,
      details
    };

    this.errorLog.push(warningEntry);

    if (this.isEnabled) {
      console.warn('\n' + '⚠️ '.repeat(15));
      console.warn('⚠️  PIPELINE WARNING ⚠️');
      console.warn('⚠️ '.repeat(15));
      console.warn(`\n⚠️  MESSAGE: ${message}`);
      
      if (details) {
        console.warn(`⚠️  DETAILS:`, details);
      }
      
      console.warn(`⚠️  TIMESTAMP: ${warningEntry.timestamp.toISOString()}`);
      console.warn('\n' + '⚠️ '.repeat(15) + '\n');
    }
  }

  /**
   * Prüft und erzwingt kritische Bedingungen
   * @RequiredStep: "assert-critical-condition"
   */
  assertCriticalCondition(
    condition: boolean | (() => boolean),
    message: string,
    errorType: 'STEP_FAILED' | 'MISSING_STEP' | 'CHECKPOINT_FAILED' | 'VALIDATION_FAILED' = 'VALIDATION_FAILED'
  ): void {
    const result = typeof condition === 'function' ? condition() : condition;
    
    if (!result) {
      this.throwLoudError(
        `Critical assertion failed: ${message}`,
        errorType,
        { assertion: 'failed', condition: condition.toString() }
      );
    }
  }

  /**
   * Erzwingt dass bestimmte Dateien existieren
   * @RequiredStep: "assert-files-exist"
   */
  assertFilesExist(filePaths: string[], context?: string): void {
    const fs = require('fs');
    const missingFiles: string[] = [];

    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        missingFiles.push(filePath);
      }
    }

    if (missingFiles.length > 0) {
      this.throwLoudError(
        `Required files missing${context ? ' for ' + context : ''}: ${missingFiles.join(', ')}`,
        'VALIDATION_FAILED',
        { missingFiles, context }
      );
    }
  }

  /**
   * Erzwingt dass bestimmte Environment Variables gesetzt sind
   * @RequiredStep: "assert-env-vars"
   */
  assertEnvironmentVariables(requiredVars: string[], context?: string): void {
    const missingVars: string[] = [];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      this.throwLoudError(
        `Required environment variables missing${context ? ' for ' + context : ''}: ${missingVars.join(', ')}`,
        'VALIDATION_FAILED',
        { missingVars, context }
      );
    }
  }

  /**
   * Blockiert Operation wenn Bedingung nicht erfüllt
   * @RequiredStep: "block-operation-if"
   */
  blockOperationIf(
    condition: boolean | (() => boolean),
    operationName: string,
    reason: string
  ): void {
    const shouldBlock = typeof condition === 'function' ? condition() : condition;
    
    if (shouldBlock) {
      this.blockedOperations.add(operationName);
      this.throwLoudError(
        `Operation '${operationName}' blocked: ${reason}`,
        'SYSTEM_ERROR',
        { blockedOperation: operationName, reason }
      );
    }
  }

  /**
   * Prüft ob Operation blockiert ist
   */
  isOperationBlocked(operationName: string): boolean {
    return this.blockedOperations.has(operationName);
  }

  /**
   * Validiert kritische System-Dependencies
   * @RequiredStep: "validate-system-dependencies"
   */
  validateSystemDependencies(): void {
    const criticalChecks = [
      {
        name: 'Node.js Version',
        check: () => {
          const nodeVersion = process.version;
          const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
          return majorVersion >= 16;
        },
        error: 'Node.js version 16 or higher required'
      },
      {
        name: 'Package.json exists',
        check: () => {
          const fs = require('fs');
          return fs.existsSync('package.json');
        },
        error: 'package.json not found in project root'
      },
      {
        name: 'Node modules installed',
        check: () => {
          const fs = require('fs');
          return fs.existsSync('node_modules');
        },
        error: 'node_modules not found - run npm install'
      }
    ];

    const failedChecks: string[] = [];

    for (const check of criticalChecks) {
      try {
        if (!check.check()) {
          failedChecks.push(`${check.name}: ${check.error}`);
        }
      } catch (error) {
        failedChecks.push(`${check.name}: Check failed - ${error}`);
      }
    }

    if (failedChecks.length > 0) {
      this.throwLoudError(
        'Critical system dependencies validation failed',
        'SYSTEM_ERROR',
        { failedChecks }
      );
    }
  }

  /**
   * Setup globaler Error Handling
   */
  private setupGlobalErrorHandling(): void {
    if (this.isEnabled) {
      // Unhandled Promise Rejections
      process.on('unhandledRejection', (reason, promise) => {
        this.throwLoudError(
          'Unhandled Promise Rejection',
          'SYSTEM_ERROR',
          { reason, promise: promise.toString() }
        );
      });

      // Uncaught Exceptions
      process.on('uncaughtException', (error) => {
        this.throwLoudError(
          'Uncaught Exception',
          'SYSTEM_ERROR',
          { error: error.message, stack: error.stack }
        );
      });
    }
  }

  /**
   * Triggert registrierte Error Handler
   */
  private triggerErrorHandlers(errorType: string, message: string, details?: any): void {
    for (const handler of this.errorHandlers) {
      try {
        switch (errorType) {
          case 'STEP_FAILED':
            handler.onStepFailed?.(details?.stepName || 'unknown', new Error(message));
            break;
          case 'MISSING_STEP':
            handler.onRequiredStepMissing?.(details?.stepName || 'unknown');
            break;
          case 'CHECKPOINT_FAILED':
            handler.onCheckpointFailed?.(details?.checkpointName || 'unknown', [message]);
            break;
          default:
            handler.onPipelineFailed?.([message]);
        }
      } catch (handlerError) {
        console.error(`Error handler failed: ${handlerError}`);
      }
    }
  }

  /**
   * Blockiert alle Operationen
   */
  private blockAllOperations(): void {
    this.blockedOperations.add('*');
  }

  /**
   * Generiert eindeutige Error ID
   */
  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Error Log abrufen
   */
  getErrorLog(): Array<{ timestamp: Date; type: string; message: string; details?: any }> {
    return [...this.errorLog];
  }

  /**
   * Error Log exportieren
   */
  exportErrorLog(): string {
    return JSON.stringify(this.errorLog, null, 2);
  }

  /**
   * System zurücksetzen (nur für Tests)
   */
  reset(): void {
    this.errorLog = [];
    this.blockedOperations.clear();
  }

  /**
   * Fail Loudly aktivieren/deaktivieren
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Status des Systems abrufen
   */
  getSystemStatus(): {
    enabled: boolean;
    errorCount: number;
    warningCount: number;
    blockedOperations: string[];
    lastError?: any;
  } {
    const errors = this.errorLog.filter(entry => entry.type !== 'WARNING');
    const warnings = this.errorLog.filter(entry => entry.type === 'WARNING');

    return {
      enabled: this.isEnabled,
      errorCount: errors.length,
      warningCount: warnings.length,
      blockedOperations: Array.from(this.blockedOperations),
      lastError: errors.length > 0 ? errors[errors.length - 1] : undefined
    };
  }
}

/**
 * Globale Fail Loudly Instanz
 */
export const failLoudlyManager = new FailLoudlyManager();

/**
 * Utility-Funktionen für häufige Fail Loudly Patterns
 */
export const FailLoudlyUtils = {
  /**
   * Schnelle Assertion für nicht-null Werte
   */
  assertNotNull<T>(value: T | null | undefined, message: string): T {
    if (value === null || value === undefined) {
      failLoudlyManager.throwLoudError(`Null/undefined value: ${message}`, 'VALIDATION_FAILED');
    }
    return value as T;
  },

  /**
   * Schnelle Assertion für Arrays
   */
  assertNotEmpty<T>(array: T[], message: string): T[] {
    if (array.length === 0) {
      failLoudlyManager.throwLoudError(`Empty array: ${message}`, 'VALIDATION_FAILED');
    }
    return array;
  },

  /**
   * Schnelle File-Existence Assertion
   */
  assertFileExists(filePath: string, context?: string): void {
    failLoudlyManager.assertFilesExist([filePath], context);
  },

  /**
   * Blockiert Agent bei fehlenden Required Steps
   */
  blockAgentIfIncomplete(): void {
    const fs = require('fs');
    const path = require('path');
    
    // Prüfe ob Pipeline-System korrekt initialisiert ist
    const pipelineFiles = [
      'src/pipeline/StepRunner.ts',
      'src/pipeline/annotations.ts',
      'src/pipeline/checkpoints.ts',
      'src/pipeline/verification.ts'
    ];

    const missingPipelineFiles = pipelineFiles.filter(file => 
      !fs.existsSync(path.join(process.cwd(), file))
    );

    if (missingPipelineFiles.length > 0) {
      failLoudlyManager.throwLoudError(
        'Pipeline system incomplete - agent execution blocked',
        'SYSTEM_ERROR',
        { missingFiles: missingPipelineFiles }
      );
    }
  }
};

/**
 * Decorator für automatisches Fail Loudly bei Funktionen
 */
export function FailLoudlyOnError(errorType: 'STEP_FAILED' | 'VALIDATION_FAILED' = 'STEP_FAILED') {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);
        
        // Handle Promises
        if (result && typeof result.catch === 'function') {
          return result.catch((error: Error) => {
            failLoudlyManager.throwLoudError(
              `Function '${propertyKey}' failed: ${error.message}`,
              errorType,
              { functionName: propertyKey, error: error.message, args }
            );
          });
        }
        
        return result;
      } catch (error) {
        failLoudlyManager.throwLoudError(
          `Function '${propertyKey}' failed: ${error instanceof Error ? error.message : String(error)}`,
          errorType,
          { functionName: propertyKey, error: error instanceof Error ? error.message : String(error), args }
        );
      }
    };

    return descriptor;
  };
}