/**
 * Pipeline Types - Definiert alle Typen für das erzwungene Schritte-System
 */

/**
 * Metadaten für @RequiredStep Annotation
 */
export interface RequiredStepMetadata {
  stepName: string;
  description?: string;
  dependencies?: string[];
  timeout?: number;
  retries?: number;
}

/**
 * Ergebnis einer Schritt-Ausführung
 */
export interface StepResult {
  stepName: string;
  success: boolean;
  result?: any;
  error?: string;
  timestamp: Date;
  executionTime: number;
  metadata?: RequiredStepMetadata;
}

/**
 * Validierungs-Checkpoint für Schritte
 */
export interface StepValidationCheckpoint {
  requiredSteps: string[];
  assertions?: (() => boolean)[];
  customValidators?: ((results: Map<string, StepResult>) => boolean)[];
}

/**
 * Pipeline Checkpoint
 */
export interface PipelineCheckpoint {
  name: string;
  timestamp: Date;
  requiredConditions: StepValidationCheckpoint;
  passed: boolean;
  errorMessage?: string;
}

/**
 * Pipeline Konfiguration
 */
export interface PipelineConfig {
  failLoud: boolean;
  enableLogging: boolean;
  enforceRequiredSteps: boolean;
  allowPartialExecution: boolean;
  timeoutMs?: number;
}

/**
 * Agent-Validierung für KI-Systeme
 */
export interface AgentValidationResult {
  agentName: string;
  timestamp: Date;
  requiredStepsCompleted: boolean;
  pipelineStatus: string;
  missingSteps: string[];
  checklistPassed: boolean;
  errors: string[];
}

/**
 * JSON-Checkliste Struktur für Selbstverifikation
 */
export interface VerificationChecklist {
  step_analysis: boolean;
  i18n_applied: boolean;
  translations_checked: boolean;
  tests_passed: boolean;
  code_quality_verified: boolean;
  security_checks_passed: boolean;
  documentation_updated: boolean;
  [key: string]: boolean;
}

/**
 * Schritt-Status für Tracking
 */
export enum StepStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

/**
 * Pipeline-Execution Context
 */
export interface PipelineContext {
  projectPath: string;
  agentName?: string;
  sessionId: string;
  startTime: Date;
  environment: 'development' | 'testing' | 'production';
  variables: Map<string, any>;
}

/**
 * Error-Handler Interface
 */
export interface PipelineErrorHandler {
  onStepFailed: (stepName: string, error: Error) => void;
  onRequiredStepMissing: (stepName: string) => void;
  onCheckpointFailed: (checkpointName: string, errors: string[]) => void;
  onPipelineFailed: (errors: string[]) => void;
}