/**
 * @RequiredStep Annotation System
 * 
 * Dieses System ermöglicht es, Funktionen als "erforderliche Schritte" zu markieren,
 * die von KI-Agenten zwingend ausgeführt werden müssen.
 */

import { RequiredStepMetadata, StepResult } from './types';

/**
 * Registry für alle @RequiredStep markierten Funktionen
 */
class RequiredStepRegistry {
  private static instance: RequiredStepRegistry;
  private registeredSteps: Map<string, RequiredStepMetadata> = new Map();
  private executedSteps: Map<string, StepResult> = new Map();

  static getInstance(): RequiredStepRegistry {
    if (!RequiredStepRegistry.instance) {
      RequiredStepRegistry.instance = new RequiredStepRegistry();
    }
    return RequiredStepRegistry.instance;
  }

  registerStep(metadata: RequiredStepMetadata): void {
    this.registeredSteps.set(metadata.stepName, metadata);
  }

  markStepExecuted(stepName: string, result: StepResult): void {
    this.executedSteps.set(stepName, result);
  }

  getRegisteredSteps(): string[] {
    return Array.from(this.registeredSteps.keys());
  }

  getExecutedSteps(): string[] {
    return Array.from(this.executedSteps.keys());
  }

  getMissingSteps(): string[] {
    const registered = this.getRegisteredSteps();
    const executed = this.getExecutedSteps();
    return registered.filter(step => !executed.includes(step));
  }

  validateAllStepsExecuted(): boolean {
    return this.getMissingSteps().length === 0;
  }

  reset(): void {
    this.executedSteps.clear();
  }

  getStepMetadata(stepName: string): RequiredStepMetadata | undefined {
    return this.registeredSteps.get(stepName);
  }

  getAllStepResults(): Map<string, StepResult> {
    return new Map(this.executedSteps);
  }
}

/**
 * @RequiredStep Decorator für Funktionen
 * 
 * Verwendung:
 * @RequiredStep("step-name", { description: "Was dieser Schritt macht" })
 * function myFunction() { ... }
 */
export function RequiredStep(stepName: string, options: Partial<RequiredStepMetadata> = {}) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const registry = RequiredStepRegistry.getInstance();
    
    const metadata: RequiredStepMetadata = {
      stepName,
      description: options.description || `Required step: ${String(propertyKey)}`,
      dependencies: options.dependencies || [],
      timeout: options.timeout || 30000,
      retries: options.retries || 0
    };

    registry.registerStep(metadata);

    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = function(this: any, ...args: any[]) {
      const startTime = Date.now();
      
      try {
        console.log(`🔄 Executing @RequiredStep: ${stepName}`);
        
        // Prüfe Abhängigkeiten
        if (metadata.dependencies && metadata.dependencies.length > 0) {
          const executedSteps = registry.getExecutedSteps();
          const missingDependencies = metadata.dependencies.filter(dep => !executedSteps.includes(dep));
          
          if (missingDependencies.length > 0) {
            throw new Error(`Missing dependencies for step '${stepName}': ${missingDependencies.join(', ')}`);
          }
        }

        const result = originalMethod.apply(this, args);
        const executionTime = Date.now() - startTime;

        // Markiere Schritt als ausgeführt
        const stepResult: StepResult = {
          stepName,
          success: true,
          result,
          timestamp: new Date(),
          executionTime,
          metadata
        };

        registry.markStepExecuted(stepName, stepResult);
        console.log(`✅ @RequiredStep completed: ${stepName} (${executionTime}ms)`);

        return result;
      } catch (error) {
        const executionTime = Date.now() - startTime;
        const stepResult: StepResult = {
          stepName,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
          executionTime,
          metadata
        };

        registry.markStepExecuted(stepName, stepResult);
        console.error(`❌ @RequiredStep failed: ${stepName} - ${stepResult.error}`);
        
        throw error;
      }
    } as T;

    return descriptor;
  };
}

/**
 * Comment-basierte @RequiredStep Erkennung
 * 
 * Für Projekte, die keine Decorators verwenden können.
 * Erkennt Kommentare wie: // @RequiredStep: "step-name"
 */
export class CommentBasedStepDetector {
  private registry = RequiredStepRegistry.getInstance();

  /**
   * Analysiert Code-String nach @RequiredStep Kommentaren
   */
  analyzeCode(code: string, filePath: string): string[] {
    const requiredStepPattern = /\/\/\s*@RequiredStep:\s*["']([^"']+)["']/g;
    const foundSteps: string[] = [];
    let match;

    while ((match = requiredStepPattern.exec(code)) !== null) {
      const stepName = match[1];
      foundSteps.push(stepName);
      
      // Registriere den Schritt
      this.registry.registerStep({
        stepName,
        description: `Step found in ${filePath}`,
        dependencies: []
      });
    }

    return foundSteps;
  }

  /**
   * Analysiert eine Datei nach @RequiredStep Kommentaren
   */
  async analyzeFile(filePath: string): Promise<string[]> {
    try {
      const fs = await import('fs');
      const code = fs.readFileSync(filePath, 'utf-8');
      return this.analyzeCode(code, filePath);
    } catch (error) {
      console.warn(`Could not analyze file ${filePath}: ${error}`);
      return [];
    }
  }

  /**
   * Markiert einen kommentierten Schritt als ausgeführt
   */
  markCommentStepExecuted(stepName: string, functionName: string): void {
    const stepResult: StepResult = {
      stepName,
      success: true,
      result: `Executed ${functionName}`,
      timestamp: new Date(),
      executionTime: 0
    };

    this.registry.markStepExecuted(stepName, stepResult);
    console.log(`✅ Comment-based @RequiredStep executed: ${stepName}`);
  }
}

/**
 * Validator für @RequiredStep Ausführung
 */
export class RequiredStepValidator {
  private registry = RequiredStepRegistry.getInstance();

  /**
   * Validiert ob alle required steps ausgeführt wurden
   */
  validateAllStepsExecuted(): { valid: boolean; missingSteps: string[]; errors: string[] } {
    const missingSteps = this.registry.getMissingSteps();
    const errors: string[] = [];

    // Prüfe fehlende Schritte
    if (missingSteps.length > 0) {
      errors.push(`Missing required steps: ${missingSteps.join(', ')}`);
    }

    // Prüfe fehlgeschlagene Schritte
    const allResults = this.registry.getAllStepResults();
    const failedSteps = Array.from(allResults.entries())
      .filter(([_, result]) => !result.success)
      .map(([stepName, _]) => stepName);

    if (failedSteps.length > 0) {
      errors.push(`Failed steps: ${failedSteps.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      missingSteps,
      errors
    };
  }

  /**
   * Generiert Validierungs-Report
   */
  generateValidationReport(): object {
    const registeredSteps = this.registry.getRegisteredSteps();
    const executedSteps = this.registry.getExecutedSteps();
    const missingSteps = this.registry.getMissingSteps();
    const allResults = this.registry.getAllStepResults();

    const failedSteps = Array.from(allResults.entries())
      .filter(([_, result]) => !result.success);

    const successfulSteps = Array.from(allResults.entries())
      .filter(([_, result]) => result.success);

    return {
      summary: {
        total_registered: registeredSteps.length,
        total_executed: executedSteps.length,
        total_missing: missingSteps.length,
        total_failed: failedSteps.length,
        total_successful: successfulSteps.length,
        completion_percentage: registeredSteps.length > 0 
          ? Math.round((executedSteps.length / registeredSteps.length) * 100) 
          : 100
      },
      steps: {
        registered: registeredSteps,
        executed: executedSteps,
        missing: missingSteps,
        failed: failedSteps.map(([name, result]) => ({ name, error: result.error })),
        successful: successfulSteps.map(([name, result]) => ({ 
          name, 
          executionTime: result.executionTime 
        }))
      },
      validation: this.validateAllStepsExecuted(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Fail Loudly wenn nicht alle Steps ausgeführt wurden
   */
  enforceAllStepsExecuted(): void {
    const validation = this.validateAllStepsExecuted();
    
    if (!validation.valid) {
      const errorMessage = `🚨 REQUIRED STEPS VALIDATION FAILED:\n${validation.errors.join('\n')}`;
      console.error('\n' + '='.repeat(80));
      console.error(errorMessage);
      console.error('='.repeat(80) + '\n');
      throw new Error(errorMessage);
    }

    console.log('✅ All required steps validated successfully!');
  }
}

// Singleton Instanzen für globalen Zugriff
export const stepRegistry = RequiredStepRegistry.getInstance();
export const stepValidator = new RequiredStepValidator();
export const commentDetector = new CommentBasedStepDetector();

/**
 * Utility Funktion für manuelle Schritt-Registrierung
 */
export function registerRequiredStep(stepName: string, metadata: Partial<RequiredStepMetadata> = {}): void {
  const registry = RequiredStepRegistry.getInstance();
  
  const fullMetadata: RequiredStepMetadata = {
    stepName,
    description: metadata.description || `Manually registered step: ${stepName}`,
    dependencies: metadata.dependencies || [],
    timeout: metadata.timeout || 30000,
    retries: metadata.retries || 0
  };

  registry.registerStep(fullMetadata);
}

/**
 * Utility Funktion für manuelle Schritt-Ausführung
 */
export function markStepExecuted(stepName: string, success: boolean = true, result?: any, error?: string): void {
  const registry = RequiredStepRegistry.getInstance();
  
  const stepResult: StepResult = {
    stepName,
    success,
    result,
    error,
    timestamp: new Date(),
    executionTime: 0
  };

  registry.markStepExecuted(stepName, stepResult);
}