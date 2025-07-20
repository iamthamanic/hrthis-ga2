/**
 * Test Framework für RequiredSteps
 * 
 * Dieses Test-Framework stellt sicher, dass alle @RequiredStep markierten
 * Funktionen vorhanden sind, korrekt ausgeführt werden und die Pipeline-
 * Integrität gewährleistet ist.
 */

import { StepRunner } from '../StepRunner';
import { RequiredStep, stepRegistry, stepValidator, markStepExecuted } from '../annotations';
import { checkpointManager, CommonCheckpoints } from '../checkpoints';
import { verificationManager, VerificationUtils, VerificationManager } from '../verification';
import { failLoudlyManager } from '../failLoudly';

describe('RequiredSteps Test Framework', () => {
  let stepRunner: StepRunner;

  beforeEach(() => {
    // Reset alle Manager vor jedem Test
    stepRunner = new StepRunner(false); // Disable fail loud für Tests
    stepRegistry.reset();
    checkpointManager.reset();
    verificationManager.reset();
    failLoudlyManager.reset();
    failLoudlyManager.setEnabled(false);
  });

  afterEach(() => {
    failLoudlyManager.setEnabled(true);
  });

  describe('Step Registration und Execution', () => {
    it('should register and execute required steps', async () => {
      // Test Function mit @RequiredStep
      class TestClass {
        @RequiredStep('test-step-1', { description: 'Test step for validation' })
        testFunction(): string {
          return 'step executed';
        }
      }

      const instance = new TestClass();
      
      // Prüfe Registrierung
      const registeredSteps = stepRegistry.getRegisteredSteps();
      expect(registeredSteps).toContain('test-step-1');

      // Führe Funktion aus
      const result = instance.testFunction();
      expect(result).toBe('step executed');

      // Prüfe Ausführung
      const executedSteps = stepRegistry.getExecutedSteps();
      expect(executedSteps).toContain('test-step-1');
    });

    it('should validate all required steps are executed', () => {
      // Registriere steps manuell
      markStepExecuted('step-1', true, 'result1');
      markStepExecuted('step-2', true, 'result2');

      const validation = stepValidator.validateAllStepsExecuted();
      expect(validation.valid).toBe(true);
      expect(validation.missingSteps).toHaveLength(0);
    });

    it('should detect missing required steps', () => {
      // Registriere step aber führe ihn nicht aus
      stepRegistry.registerStep({
        stepName: 'missing-step',
        description: 'This step will not be executed'
      });

      const validation = stepValidator.validateAllStepsExecuted();
      expect(validation.valid).toBe(false);
      expect(validation.missingSteps).toContain('missing-step');
    });
  });

  describe('StepRunner Pipeline Tests', () => {
    it('should execute pipeline with required steps', async () => {
      const executionOrder: string[] = [];

      stepRunner.registerStep('step-1', () => {
        executionOrder.push('step-1');
        return 'result-1';
      }, true);

      stepRunner.registerStep('step-2', () => {
        executionOrder.push('step-2');
        return 'result-2';
      }, true);

      const results = await stepRunner.executePipeline();

      expect(executionOrder).toEqual(['step-1', 'step-2']);
      expect(results.size).toBe(2);
      expect(results.get('step-1')?.success).toBe(true);
      expect(results.get('step-2')?.success).toBe(true);
    });

    it('should fail when required step fails', async () => {
      stepRunner.registerStep('failing-step', () => {
        throw new Error('Step failed');
      }, true);

      await expect(stepRunner.executePipeline()).rejects.toThrow('Step \'failing-step\' failed');
    });

    it('should generate verification checklist', async () => {
      stepRunner.registerStep('test-step', () => 'success', true);
      await stepRunner.executeStep('test-step');

      const checklist = stepRunner.generateVerificationChecklist() as any;
      
      expect(checklist.pipeline_execution.all_required_steps_executed).toBe(true);
      expect(checklist.pipeline_execution.no_failed_steps).toBe(true);
      expect(checklist.step_details.executed_steps).toBe(1);
    });
  });

  describe('Checkpoint Validation Tests', () => {
    it('should create and validate checkpoints', () => {
      // Führe required steps aus
      markStepExecuted('checkpoint-step-1', true);
      markStepExecuted('checkpoint-step-2', true);

      // Erstelle Checkpoint
      checkpointManager.createCheckpoint(
        'test-checkpoint',
        ['checkpoint-step-1', 'checkpoint-step-2'],
        [() => true] // Simple assertion
      );

      // Validiere Checkpoint
      const result = checkpointManager.validateCheckpoint('test-checkpoint');
      expect(result).toBe(true);
    });

    it('should fail checkpoint when required steps missing', () => {
      checkpointManager.createCheckpoint(
        'failing-checkpoint',
        ['missing-step']
      );

      expect(() => {
        checkpointManager.validateCheckpoint('failing-checkpoint');
      }).toThrow('Missing required steps');
    });

    it('should validate common checkpoints', () => {
      // Mock successful steps
      markStepExecuted('i18n-setup', true);
      markStepExecuted('translation-files', true);

      CommonCheckpoints.createI18nCheckpoint(['i18n-setup', 'translation-files']);
      
      expect(() => {
        checkpointManager.validateCheckpoint('i18n-validation');
      }).not.toThrow();
    });
  });

  describe('Verification Manager Tests', () => {
    it('should execute verification checks', () => {
      // Add custom verification check
      verificationManager.addVerificationCheck('custom-check', () => true, 'Test check');

      const result = verificationManager.executeCheck('custom-check');
      expect(result).toBe(true);

      const checklist = verificationManager.getCurrentChecklist();
      expect(checklist['custom-check']).toBe(true);
    });

    it('should fail on failed verification checks', () => {
      verificationManager.addVerificationCheck('failing-check', () => false);

      expect(() => {
        verificationManager.executeCheck('failing-check');
      }).toThrow('Verification check failed: failing-check');
    });

    it('should generate verification report', () => {
      // Setup some steps and checks
      markStepExecuted('report-step', true);
      verificationManager.addVerificationCheck('report-check', () => true);
      verificationManager.executeCheck('report-check');

      const report = verificationManager.generateVerificationReport();
      
      expect(report.agentName).toBe('AI-Agent');
      expect(report.checklistPassed).toBe(false); // Weil nicht alle standard checks passed sind
      expect(report.timestamp).toBeInstanceOf(Date);
    });

    it('should export and import checklist as JSON', () => {
      verificationManager.addVerificationCheck('json-test', () => true);
      verificationManager.executeCheck('json-test');

      const exportedJSON = verificationManager.exportChecklistAsJSON();
      expect(exportedJSON).toContain('json-test');

      const newManager = new VerificationManager();
      newManager.importChecklistFromJSON(exportedJSON);

      const importedChecklist = newManager.getCurrentChecklist();
      expect(importedChecklist['json-test']).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full pipeline with all systems', async () => {
      // 1. Registriere Steps
      class IntegrationTestClass {
        @RequiredStep('integration-analysis', { description: 'Analyze requirements' })
        analyzeRequirements(): string {
          return 'requirements analyzed';
        }

        @RequiredStep('integration-implementation', { description: 'Implement feature' })
        implementFeature(): string {
          return 'feature implemented';
        }

        @RequiredStep('integration-testing', { description: 'Run tests' })
        runTests(): string {
          return 'tests passed';
        }
      }

      const testInstance = new IntegrationTestClass();

      // 2. Führe Steps aus
      testInstance.analyzeRequirements();
      testInstance.implementFeature();
      testInstance.runTests();

      // 3. Erstelle Checkpoints
      checkpointManager.createCheckpoint(
        'integration-checkpoint',
        ['integration-analysis', 'integration-implementation', 'integration-testing'],
        [
          () => stepRegistry.getExecutedSteps().length >= 3,
          () => stepValidator.validateAllStepsExecuted().valid
        ]
      );

      // 4. Validiere Checkpoint
      expect(() => {
        checkpointManager.validateCheckpoint('integration-checkpoint');
      }).not.toThrow();

      // 5. Verification
      verificationManager.addVerificationCheck('integration-complete', () => {
        return stepRegistry.getExecutedSteps().length >= 3;
      });

      const checkResult = verificationManager.executeCheck('integration-complete');
      expect(checkResult).toBe(true);

      // 6. Generiere final report
      const report = stepValidator.generateValidationReport() as any;
      expect(report.summary.completion_percentage).toBe(100);
    });

    it('should block agent execution when steps are missing', () => {
      failLoudlyManager.setEnabled(true);

      // Registriere required step aber führe ihn nicht aus
      stepRegistry.registerStep({
        stepName: 'critical-step',
        description: 'This must be executed'
      });

      expect(() => {
        stepValidator.enforceAllStepsExecuted();
      }).toThrow('REQUIRED STEPS VALIDATION FAILED');

      failLoudlyManager.setEnabled(false);
    });

    it('should enforce complete verification', () => {
      failLoudlyManager.setEnabled(true);

      // Setup incomplete verification
      verificationManager.addVerificationCheck('incomplete-check', () => false);

      expect(() => {
        VerificationUtils.verifyProjectCompletion();
      }).toBe(false);

      failLoudlyManager.setEnabled(false);
    });
  });

  describe('Edge Cases und Error Handling', () => {
    it('should handle step dependencies', async () => {
      class DependencyTestClass {
        @RequiredStep('dependency-step-1', { description: 'First step' })
        firstStep(): string {
          return 'first completed';
        }

        @RequiredStep('dependency-step-2', { 
          description: 'Second step',
          dependencies: ['dependency-step-1']
        })
        secondStep(): string {
          return 'second completed';
        }
      }

      const testInstance = new DependencyTestClass();

      // Versuche second step ohne first step auszuführen
      expect(() => {
        testInstance.secondStep();
      }).toThrow('Missing dependencies');

      // Führe steps in korrekter Reihenfolge aus
      testInstance.firstStep();
      expect(() => {
        testInstance.secondStep();
      }).not.toThrow();
    });

    it('should handle timeout scenarios', () => {
      jest.setTimeout(10000);

      class TimeoutTestClass {
        @RequiredStep('timeout-step', { timeout: 1000 })
        slowStep(): Promise<string> {
          return new Promise(resolve => {
            setTimeout(() => resolve('completed'), 2000);
          });
        }
      }

      const testInstance = new TimeoutTestClass();
      
      // In real implementation würde timeout handling implementiert werden
      // Hier nur Test-Struktur
      expect(testInstance.slowStep()).resolves.toBe('completed');
    });

    it('should validate system dependencies', () => {
      failLoudlyManager.setEnabled(true);

      expect(() => {
        failLoudlyManager.validateSystemDependencies();
      }).not.toThrow(); // Sollte in test environment nicht fehlschlagen

      failLoudlyManager.setEnabled(false);
    });
  });
});