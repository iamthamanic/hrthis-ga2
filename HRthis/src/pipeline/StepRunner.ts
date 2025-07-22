import { RequiredStepMetadata as _RequiredStepMetadata, StepResult, StepValidationCheckpoint, PipelineCheckpoint } from './types';

/**
 * StepRunner - Zentrale Pipeline-Klasse für erzwungene Ausführung aller Arbeitsschritte
 * 
 * Diese Klasse stellt sicher, dass KI-Agenten alle notwendigen Schritte ausführen müssen
 * und keine relevanten Operationen übersprungen werden können.
 */
export class StepRunner {
  private steps: Map<string, Function> = new Map();
  private requiredSteps: Set<string> = new Set();
  private executedSteps: Set<string> = new Set();
  private checkpoints: Map<string, PipelineCheckpoint> = new Map();
  private validationResults: Map<string, StepResult> = new Map();
  private isFailLoudEnabled: boolean = true;

  constructor(failLoud: boolean = true) {
    this.isFailLoudEnabled = failLoud;
  }

  /**
   * Registriert einen Schritt mit der Pipeline
   * @RequiredStep: "register-step"
   */
  registerStep(stepName: string, stepFunction: Function, isRequired: boolean = false): void {
    if (!stepName || typeof stepFunction !== 'function') {
      this.throwLoudError(`Invalid step registration: stepName='${stepName}', function=${typeof stepFunction}`);
    }

    this.steps.set(stepName, stepFunction);
    
    if (isRequired) {
      this.requiredSteps.add(stepName);
    }

    this.logStep(`Step registered: ${stepName} (required: ${isRequired})`);
  }

  /**
   * Führt einen einzelnen Schritt aus
   * @RequiredStep: "execute-step"
   */
  async executeStep(stepName: string, ...args: any[]): Promise<StepResult> {
    if (!this.steps.has(stepName)) {
      this.throwLoudError(`Step '${stepName}' not found! Available steps: ${Array.from(this.steps.keys()).join(', ')}`);
    }

    this.logStep(`Executing step: ${stepName}`);
    
    try {
      const stepFunction = this.steps.get(stepName)!;
      const result = await stepFunction(...args);
      
      const stepResult: StepResult = {
        stepName,
        success: true,
        result,
        timestamp: new Date(),
        executionTime: 0
      };

      this.executedSteps.add(stepName);
      this.validationResults.set(stepName, stepResult);
      
      this.logStep(`Step completed successfully: ${stepName}`);
      return stepResult;
      
    } catch (error) {
      const stepResult: StepResult = {
        stepName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        executionTime: 0
      };

      this.validationResults.set(stepName, stepResult);
      this.throwLoudError(`Step '${stepName}' failed: ${stepResult.error}`);
    }
  }

  /**
   * Führt alle registrierten Schritte in Reihenfolge aus
   * @RequiredStep: "execute-pipeline"
   */
  async executePipeline(): Promise<Map<string, StepResult>> {
    this.logStep('Starting pipeline execution...');
    
    // Zuerst alle required steps ausführen
    Array.from(this.requiredSteps).forEach(async (stepName) => {
      if (!this.executedSteps.has(stepName)) {
        await this.executeStep(stepName);
      }
    });

    // Dann alle anderen steps
    Array.from(this.steps.keys()).forEach(async (stepName) => {
      if (!this.executedSteps.has(stepName)) {
        await this.executeStep(stepName);
      }
    });

    this.validateAllRequiredStepsCompleted();
    this.logStep('Pipeline execution completed successfully');
    
    return this.validationResults;
  }

  /**
   * Erstellt einen Checkpoint für Validierung
   * @RequiredStep: "create-checkpoint"
   */
  createCheckpoint(checkpointName: string, validation: StepValidationCheckpoint): void {
    const checkpoint: PipelineCheckpoint = {
      name: checkpointName,
      timestamp: new Date(),
      requiredConditions: validation,
      passed: false
    };

    this.checkpoints.set(checkpointName, checkpoint);
    this.logStep(`Checkpoint created: ${checkpointName}`);
  }

  /**
   * Validiert einen Checkpoint
   * @RequiredStep: "validate-checkpoint"
   */
  validateCheckpoint(checkpointName: string): boolean {
    const checkpoint = this.checkpoints.get(checkpointName);
    if (!checkpoint) {
      this.throwLoudError(`Checkpoint '${checkpointName}' not found!`);
    }

    const validation = checkpoint.requiredConditions;
    let allConditionsMet = true;

    // Prüfe required steps
    for (const stepName of validation.requiredSteps) {
      if (!this.executedSteps.has(stepName)) {
        this.throwLoudError(`Required step '${stepName}' not executed for checkpoint '${checkpointName}'`);
      }
    }

    // Prüfe custom assertions
    for (const assertion of validation.assertions || []) {
      try {
        const result = assertion();
        if (!result) {
          allConditionsMet = false;
          this.throwLoudError(`Assertion failed for checkpoint '${checkpointName}'`);
        }
      } catch (error) {
        allConditionsMet = false;
        this.throwLoudError(`Assertion error for checkpoint '${checkpointName}': ${error}`);
      }
    }

    checkpoint.passed = allConditionsMet;
    this.logStep(`Checkpoint validated: ${checkpointName} (passed: ${allConditionsMet})`);
    
    return allConditionsMet;
  }

  /**
   * Validiert dass alle required steps ausgeführt wurden
   * @RequiredStep: "validate-required-steps"
   */
  validateAllRequiredStepsCompleted(): void {
    const missingSteps = Array.from(this.requiredSteps).filter(step => !this.executedSteps.has(step));
    
    if (missingSteps.length > 0) {
      this.throwLoudError(`Missing required steps: ${missingSteps.join(', ')}`);
    }

    this.logStep('All required steps validated successfully');
  }

  /**
   * Generiert JSON-Checkliste für Selbstverifikation
   * @RequiredStep: "generate-verification-checklist"
   */
  generateVerificationChecklist(): object {
    const checklist = {
      pipeline_execution: {
        all_steps_registered: this.steps.size > 0,
        all_required_steps_executed: Array.from(this.requiredSteps).every(step => this.executedSteps.has(step)),
        no_failed_steps: Array.from(this.validationResults.values()).every(result => result.success),
        all_checkpoints_passed: Array.from(this.checkpoints.values()).every(checkpoint => checkpoint.passed)
      },
      step_details: {
        total_steps: this.steps.size,
        required_steps: this.requiredSteps.size,
        executed_steps: this.executedSteps.size,
        failed_steps: Array.from(this.validationResults.values()).filter(result => !result.success).length
      },
      checkpoint_details: {
        total_checkpoints: this.checkpoints.size,
        passed_checkpoints: Array.from(this.checkpoints.values()).filter(cp => cp.passed).length
      },
      verification_timestamp: new Date().toISOString(),
      pipeline_status: this.getPipelineStatus()
    };

    // Fail loud wenn nicht alle Checks bestanden
    if (!checklist.pipeline_execution.all_required_steps_executed) {
      this.throwLoudError('Verification failed: Not all required steps executed');
    }

    if (!checklist.pipeline_execution.no_failed_steps) {
      this.throwLoudError('Verification failed: Some steps failed');
    }

    if (!checklist.pipeline_execution.all_checkpoints_passed) {
      this.throwLoudError('Verification failed: Some checkpoints failed');
    }

    return checklist;
  }

  /**
   * Zurücksetzen der Pipeline für neue Ausführung
   */
  reset(): void {
    this.executedSteps.clear();
    this.validationResults.clear();
    this.checkpoints.clear();
    this.logStep('Pipeline reset completed');
  }

  /**
   * Status der Pipeline abrufen
   */
  getPipelineStatus(): string {
    const totalSteps = this.steps.size;
    const executedSteps = this.executedSteps.size;
    const requiredStepsCompleted = Array.from(this.requiredSteps).every(step => this.executedSteps.has(step));
    
    if (totalSteps === 0) return 'EMPTY';
    if (executedSteps === 0) return 'NOT_STARTED';
    if (!requiredStepsCompleted) return 'INCOMPLETE_REQUIRED';
    if (executedSteps < totalSteps) return 'IN_PROGRESS';
    if (executedSteps === totalSteps) return 'COMPLETED';
    
    return 'UNKNOWN';
  }

  /**
   * Sichtbarer Fehler (Fail Loudly)
   */
  private throwLoudError(message: string): never {
    const errorMessage = `🚨 PIPELINE ERROR: ${message}`;
    
    if (this.isFailLoudEnabled) {
      console.error('\n' + '='.repeat(80));
      console.error(errorMessage);
      console.error('='.repeat(80) + '\n');
    }
    
    throw new Error(errorMessage);
  }

  /**
   * Logging für Schritte
   */
  private logStep(message: string): void {
    if (this.isFailLoudEnabled) {
      console.log(`[StepRunner] ${message}`);
    }
  }

  /**
   * Debug-Informationen ausgeben
   */
  debugInfo(): object {
    return {
      registeredSteps: Array.from(this.steps.keys()),
      requiredSteps: Array.from(this.requiredSteps),
      executedSteps: Array.from(this.executedSteps),
      checkpoints: Array.from(this.checkpoints.entries()),
      validationResults: Array.from(this.validationResults.entries()),
      status: this.getPipelineStatus()
    };
  }
}