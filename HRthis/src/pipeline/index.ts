/**
 * Pipeline System - Main Export
 * 
 * Zentraler Export aller Pipeline-Komponenten für das erzwungene Schritte-System.
 * Dieses System stellt sicher, dass KI-Agenten alle notwendigen Arbeitsschritte
 * ausführen müssen und keine relevanten Operationen übersprungen werden können.
 */

// Core Pipeline Components
/**
 * Pipeline Orchestrator - Hauptklasse für KI-Agent Integration
 * 
 * Diese Klasse orchestriert alle Pipeline-Komponenten und stellt sicher,
 * dass KI-Agenten das vollständige System verwenden müssen.
 */
import { stepRegistry, stepValidator } from './annotations';
import { checkpointManager, CommonCheckpoints } from './checkpoints';
import { failLoudlyManager, FailLoudlyUtils } from './failLoudly';
import { StepRunner } from './StepRunner';
import { PipelineConfig, AgentValidationResult } from './types';
import { verificationManager, VerificationUtils } from './verification';

export { StepRunner } from './StepRunner';
export { 
  RequiredStep, 
  stepRegistry, 
  stepValidator, 
  commentDetector,
  registerRequiredStep,
  markStepExecuted 
} from './annotations';

// Checkpoint System
export { 
  CheckpointManager, 
  AssertionBuilder,
  checkpointManager,
  CommonCheckpoints 
} from './checkpoints';

// Verification System
export { 
  VerificationManager,
  verificationManager,
  VerificationUtils 
} from './verification';

// Fail Loudly System
export { 
  FailLoudlyManager,
  failLoudlyManager,
  FailLoudlyUtils,
  FailLoudlyOnError 
} from './failLoudly';

// Types
export * from './types';

export class PipelineOrchestrator {
  private stepRunner: StepRunner;
  private config: PipelineConfig;
  private sessionId: string;
  private startTime: Date;

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = {
      failLoud: true,
      enableLogging: true,
      enforceRequiredSteps: true,
      allowPartialExecution: false,
      timeoutMs: 300000, // 5 minutes default
      ...config
    };

    this.stepRunner = new StepRunner(this.config.failLoud);
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();

    this.initializePipeline();
  }

  /**
   * Initialisiert die Pipeline für KI-Agent Verwendung
   * @RequiredStep: "initialize-pipeline"
   */
  private initializePipeline(): void {
    // Setup global error handling
    failLoudlyManager.setEnabled(this.config.failLoud);

    // Validate system dependencies
    if (this.config.enforceRequiredSteps) {
      try {
        failLoudlyManager.validateSystemDependencies();
      } catch (error) {
        console.error('Pipeline initialization failed:', error);
        throw error;
      }
    }

    // Setup common checkpoints
    this.setupCommonCheckpoints();

    // Initialize verification checklist
    this.initializeVerificationChecklist();

    if (this.config.enableLogging) {
      console.log(`[PipelineOrchestrator] Initialized with session ID: ${this.sessionId}`);
    }
  }

  /**
   * Setup Standard-Checkpoints für häufige Workflows
   */
  private setupCommonCheckpoints(): void {
    CommonCheckpoints.createI18nCheckpoint();
    CommonCheckpoints.createQualityCheckpoint();
    CommonCheckpoints.createDocumentationCheckpoint();
    CommonCheckpoints.createCompleteValidationCheckpoint();
  }

  /**
   * Initialisiert Standard-Verifikations-Checkliste
   */
  private initializeVerificationChecklist(): void {
    // Project structure checks
    verificationManager.addVerificationCheck('project-structure-valid', () => {
      return FailLoudlyUtils.assertFileExists('package.json', 'project root'), true;
    });

    // Dependencies installed
    verificationManager.addVerificationCheck('dependencies-installed', () => {
      const fs = require('fs');
      return fs.existsSync('node_modules');
    });

    // Pipeline system integrity
    verificationManager.addVerificationCheck('pipeline-system-complete', () => {
      const requiredFiles = [
        'src/pipeline/StepRunner.ts',
        'src/pipeline/annotations.ts',
        'src/pipeline/checkpoints.ts',
        'src/pipeline/verification.ts',
        'src/pipeline/failLoudly.ts'
      ];

      try {
        failLoudlyManager.assertFilesExist(requiredFiles, 'Pipeline system');
        return true;
      } catch {
        return false;
      }
    });
  }

  /**
   * Zwingt KI-Agent zur Ausführung aller registrierten Schritte
   * @RequiredStep: "enforce-agent-execution"
   */
  async enforceAgentExecution(): Promise<AgentValidationResult> {
    const executionStart = Date.now();

    try {
      // 1. Validate all required steps are executed
      if (this.config.enforceRequiredSteps) {
        stepValidator.enforceAllStepsExecuted();
      }

      // 2. Validate all checkpoints
      checkpointManager.validateAllCheckpoints();

      // 3. Run complete verification
      const verificationPassed = VerificationUtils.verifyProjectCompletion();

      if (!verificationPassed) {
        throw new Error('Complete verification failed');
      }

      // 4. Generate final validation result
      const result = this.generateValidationResult(true, executionStart);

      if (this.config.enableLogging) {
        console.log('✅ Agent execution enforcement completed successfully');
      }

      return result;

    } catch (error) {
      const result = this.generateValidationResult(false, executionStart, error);
      
      if (this.config.failLoud) {
        failLoudlyManager.throwLoudError(
          `Agent execution enforcement failed: ${error instanceof Error ? error.message : String(error)}`,
          'VALIDATION_FAILED',
          { sessionId: this.sessionId, result }
        );
      }

      return result;
    }
  }

  /**
   * Generiert Validierungs-Ergebnis
   */
  private generateValidationResult(
    success: boolean, 
    executionStart: number, 
    error?: any
  ): AgentValidationResult {
    const validation = stepValidator.validateAllStepsExecuted();
    const executionTime = Date.now() - executionStart;

    return {
      agentName: 'AI-Agent',
      timestamp: new Date(),
      requiredStepsCompleted: validation.valid,
      pipelineStatus: success ? 'COMPLETE' : 'FAILED',
      missingSteps: validation.missingSteps,
      checklistPassed: success,
      errors: success ? [] : [
        ...validation.errors,
        error ? error.message || String(error) : 'Unknown error'
      ]
    };
  }

  /**
   * Registriert einen Step mit automatischer Validierung
   * @RequiredStep: "register-validated-step"
   */
  registerValidatedStep(
    stepName: string, 
    stepFunction: Function, 
    isRequired: boolean = true,
    checkpointName?: string
  ): void {
    // Registriere Step im StepRunner
    this.stepRunner.registerStep(stepName, stepFunction, isRequired);

    // Erstelle automatischen Checkpoint wenn gewünscht
    if (checkpointName) {
      checkpointManager.createCheckpoint(
        checkpointName,
        [stepName],
        [() => stepRegistry.getExecutedSteps().includes(stepName)]
      );
    }

    if (this.config.enableLogging) {
      console.log(`[PipelineOrchestrator] Registered validated step: ${stepName}`);
    }
  }

  /**
   * Führt Pipeline-Workflow aus mit vollständiger Validierung
   * @RequiredStep: "execute-validated-workflow"
   */
  async executeValidatedWorkflow(): Promise<Map<string, any>> {
    if (this.config.enableLogging) {
      console.log('[PipelineOrchestrator] Starting validated workflow execution...');
    }

    // 1. Execute pipeline
    const pipelineResults = await this.stepRunner.executePipeline();

    // 2. Validate checkpoints
    checkpointManager.validateAllCheckpoints();

    // 3. Run verification
    const checklist = verificationManager.executeAllChecks();

    // 4. Generate final report
    const validationReport = verificationManager.generateVerificationReport();

    if (this.config.enableLogging) {
      console.log('[PipelineOrchestrator] Validated workflow completed');
      console.log('Pipeline Results:', pipelineResults.size, 'steps executed');
      console.log('Verification:', validationReport.checklistPassed ? 'PASSED' : 'FAILED');
    }

    return pipelineResults;
  }

  /**
   * Exportiert kompletten Pipeline-Status für Debugging
   */
  exportPipelineStatus(): object {
    return {
      session: {
        id: this.sessionId,
        startTime: this.startTime,
        duration: Date.now() - this.startTime.getTime(),
        config: this.config
      },
      steps: {
        registered: stepRegistry.getRegisteredSteps(),
        executed: stepRegistry.getExecutedSteps(),
        missing: stepRegistry.getMissingSteps(),
        results: stepRegistry.getAllStepResults()
      },
      checkpoints: checkpointManager.getCheckpointStatus(),
      verification: {
        checklist: verificationManager.getCurrentChecklist(),
        report: verificationManager.generateVerificationReport()
      },
      systemStatus: failLoudlyManager.getSystemStatus(),
      pipelineStatus: this.stepRunner.getPipelineStatus()
    };
  }

  /**
   * Reset Pipeline für neue Session
   */
  reset(): void {
    this.stepRunner.reset();
    stepRegistry.reset();
    checkpointManager.reset();
    verificationManager.reset();
    failLoudlyManager.reset();

    this.sessionId = this.generateSessionId();
    this.startTime = new Date();

    if (this.config.enableLogging) {
      console.log(`[PipelineOrchestrator] Reset completed. New session: ${this.sessionId}`);
    }
  }

  /**
   * Generiert eindeutige Session ID
   */
  private generateSessionId(): string {
    return `PIPELINE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Aktuelle Session Info
   */
  getSessionInfo(): object {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime.getTime(),
      config: this.config
    };
  }
}

/**
 * Default Pipeline Instance für globale Verwendung
 */
export const defaultPipeline = new PipelineOrchestrator();

/**
 * Utility-Funktionen für schnelle Pipeline-Integration
 */
export const PipelineUtils = {
  /**
   * Quick Setup für Standard-Projekt-Pipeline
   */
  setupStandardPipeline(): PipelineOrchestrator {
    return new PipelineOrchestrator({
      failLoud: true,
      enableLogging: true,
      enforceRequiredSteps: true,
      allowPartialExecution: false
    });
  },

  /**
   * Quick Setup für Test-Umgebung
   */
  setupTestPipeline(): PipelineOrchestrator {
    return new PipelineOrchestrator({
      failLoud: false,
      enableLogging: false,
      enforceRequiredSteps: true,
      allowPartialExecution: true
    });
  },

  /**
   * Enforcement für KI-Agent Compliance
   */
  enforceAgentCompliance(agentName: string = 'AI-Agent'): Promise<AgentValidationResult> {
    console.log(`🤖 Enforcing compliance for agent: ${agentName}`);
    return defaultPipeline.enforceAgentExecution();
  }
};