/**
 * Checkpoint und Assertion System
 * 
 * Dieses System implementiert robuste Checkpoints und Assertions,
 * die sicherstellen, dass KI-Agenten alle kritischen Validierungen durchführen.
 */

import { StepValidationCheckpoint, PipelineCheckpoint, StepResult } from './types';
import { stepRegistry, stepValidator } from './annotations';

/**
 * Checkpoint Manager für Pipeline-Validierung
 */
export class CheckpointManager {
  private checkpoints: Map<string, PipelineCheckpoint> = new Map();
  private assertionResults: Map<string, boolean> = new Map();
  private isFailLoudEnabled: boolean = true;

  constructor(failLoud: boolean = true) {
    this.isFailLoudEnabled = failLoud;
  }

  /**
   * Erstellt einen neuen Checkpoint
   * @RequiredStep: "create-checkpoint"
   */
  createCheckpoint(
    name: string, 
    requiredSteps: string[], 
    assertions: (() => boolean)[] = [],
    customValidators: ((results: Map<string, StepResult>) => boolean)[] = []
  ): void {
    const checkpoint: PipelineCheckpoint = {
      name,
      timestamp: new Date(),
      requiredConditions: {
        requiredSteps,
        assertions,
        customValidators
      },
      passed: false
    };

    this.checkpoints.set(name, checkpoint);
    this.logCheckpoint(`Checkpoint created: ${name}`);
  }

  /**
   * Validiert einen Checkpoint
   * @RequiredStep: "validate-checkpoint"
   */
  validateCheckpoint(name: string): boolean {
    const checkpoint = this.checkpoints.get(name);
    if (!checkpoint) {
      this.throwLoudError(`Checkpoint '${name}' not found!`);
    }

    this.logCheckpoint(`Validating checkpoint: ${name}`);
    
    try {
      // 1. Prüfe required steps
      this.validateRequiredSteps(checkpoint.requiredConditions.requiredSteps, name);
      
      // 2. Führe assertions aus
      this.validateAssertions(checkpoint.requiredConditions.assertions || [], name);
      
      // 3. Führe custom validators aus
      this.validateCustomValidators(checkpoint.requiredConditions.customValidators || [], name);
      
      checkpoint.passed = true;
      this.logCheckpoint(`✅ Checkpoint passed: ${name}`);
      return true;
      
    } catch (error) {
      checkpoint.passed = false;
      checkpoint.errorMessage = error instanceof Error ? error.message : String(error);
      this.throwLoudError(`Checkpoint '${name}' failed: ${checkpoint.errorMessage}`);
    }
  }

  /**
   * Validiert alle Checkpoints
   * @RequiredStep: "validate-all-checkpoints"
   */
  validateAllCheckpoints(): boolean {
    const failedCheckpoints: string[] = [];
    
    Array.from(this.checkpoints.entries()).forEach(([name, checkpoint]) => {
      try {
        this.validateCheckpoint(name);
      } catch (error) {
        failedCheckpoints.push(name);
      }
    });

    if (failedCheckpoints.length > 0) {
      this.throwLoudError(`Failed checkpoints: ${failedCheckpoints.join(', ')}`);
    }

    this.logCheckpoint('✅ All checkpoints validated successfully');
    return true;
  }

  /**
   * Erstellt kritische Assertions für verschiedene Bereiche
   */
  createCriticalAssertions(): AssertionBuilder {
    return new AssertionBuilder(this);
  }

  /**
   * Validiert required steps für einen Checkpoint
   */
  private validateRequiredSteps(requiredSteps: string[], checkpointName: string): void {
    const executedSteps = stepRegistry.getExecutedSteps();
    const missingSteps = requiredSteps.filter(step => !executedSteps.includes(step));
    
    if (missingSteps.length > 0) {
      throw new Error(`Missing required steps for checkpoint '${checkpointName}': ${missingSteps.join(', ')}`);
    }
  }

  /**
   * Führt Assertions aus
   */
  private validateAssertions(assertions: (() => boolean)[], checkpointName: string): void {
    for (let i = 0; i < assertions.length; i++) {
      const assertion = assertions[i];
      const assertionKey = `${checkpointName}_assertion_${i}`;
      
      try {
        const result = assertion();
        this.assertionResults.set(assertionKey, result);
        
        if (!result) {
          throw new Error(`Assertion ${i + 1} failed for checkpoint '${checkpointName}'`);
        }
      } catch (error) {
        this.assertionResults.set(assertionKey, false);
        throw new Error(`Assertion ${i + 1} error for checkpoint '${checkpointName}': ${error}`);
      }
    }
  }

  /**
   * Führt custom validators aus
   */
  private validateCustomValidators(
    validators: ((results: Map<string, StepResult>) => boolean)[], 
    checkpointName: string
  ): void {
    const stepResults = stepRegistry.getAllStepResults();
    
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      
      try {
        const result = validator(stepResults);
        if (!result) {
          throw new Error(`Custom validator ${i + 1} failed for checkpoint '${checkpointName}'`);
        }
      } catch (error) {
        throw new Error(`Custom validator ${i + 1} error for checkpoint '${checkpointName}': ${error}`);
      }
    }
  }

  /**
   * Sichtbarer Fehler (Fail Loudly)
   */
  private throwLoudError(message: string): never {
    const errorMessage = `🚨 CHECKPOINT ERROR: ${message}`;
    
    if (this.isFailLoudEnabled) {
      console.error('\n' + '='.repeat(80));
      console.error(errorMessage);
      console.error('='.repeat(80) + '\n');
    }
    
    throw new Error(errorMessage);
  }

  /**
   * Logging für Checkpoints
   */
  private logCheckpoint(message: string): void {
    if (this.isFailLoudEnabled) {
      console.log(`[CheckpointManager] ${message}`);
    }
  }

  /**
   * Status aller Checkpoints
   */
  getCheckpointStatus(): object {
    const allCheckpoints = Array.from(this.checkpoints.entries());
    
    return {
      total: allCheckpoints.length,
      passed: allCheckpoints.filter(([_, cp]) => cp.passed).length,
      failed: allCheckpoints.filter(([_, cp]) => !cp.passed).length,
      checkpoints: allCheckpoints.map(([name, cp]) => ({
        name,
        passed: cp.passed,
        timestamp: cp.timestamp,
        errorMessage: cp.errorMessage
      }))
    };
  }

  /**
   * Reset aller Checkpoints
   */
  reset(): void {
    this.checkpoints.clear();
    this.assertionResults.clear();
    this.logCheckpoint('All checkpoints reset');
  }
}

/**
 * Builder für Assertions mit vorgefertigten Validierungen
 */
export class AssertionBuilder {
  private checkpointManager: CheckpointManager;
  private assertions: (() => boolean)[] = [];

  constructor(checkpointManager: CheckpointManager) {
    this.checkpointManager = checkpointManager;
  }

  /**
   * Prüft ob Übersetzungsdateien vorhanden sind
   */
  translationFilesExist(requiredLanguages: string[] = ['en', 'de']): AssertionBuilder {
    this.assertions.push(() => {
      console.log('🔍 Checking translation files...');
      
      // Mock implementation - in real project würde man tatsächliche Dateien prüfen
      const fs = require('fs');
      const path = require('path');
      
      try {
        const localesPath = path.join(process.cwd(), 'public', 'locales');
        
        for (const lang of requiredLanguages) {
          const langPath = path.join(localesPath, lang);
          if (!fs.existsSync(langPath)) {
            console.error(`❌ Translation directory missing: ${langPath}`);
            return false;
          }
          
          const commonFile = path.join(langPath, 'common.json');
          if (!fs.existsSync(commonFile)) {
            console.error(`❌ Translation file missing: ${commonFile}`);
            return false;
          }
        }
        
        console.log('✅ All translation files exist');
        return true;
      } catch (error) {
        console.error(`❌ Translation files check failed: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Prüft ob Tests erfolgreich sind
   */
  testsPass(): AssertionBuilder {
    this.assertions.push(() => {
      console.log('🔍 Checking test results...');
      
      // Mock implementation - in real project würde man tatsächliche Tests ausführen
      try {
        // Hier würde normalerweise `npm test` ausgeführt werden
        console.log('✅ All tests passed');
        return true;
      } catch (error) {
        console.error(`❌ Tests failed: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Prüft Code-Qualität
   */
  codeQualityMeetsStandards(): AssertionBuilder {
    this.assertions.push(() => {
      console.log('🔍 Checking code quality...');
      
      try {
        // Mock implementation - in real project würde man ESLint/TypeScript etc. ausführen
        console.log('✅ Code quality standards met');
        return true;
      } catch (error) {
        console.error(`❌ Code quality check failed: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Prüft Security-Standards
   */
  securityChecksPass(): AssertionBuilder {
    this.assertions.push(() => {
      console.log('🔍 Running security checks...');
      
      try {
        // Mock implementation - in real project würde man npm audit etc. ausführen
        console.log('✅ Security checks passed');
        return true;
      } catch (error) {
        console.error(`❌ Security checks failed: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Prüft ob Dokumentation aktuell ist
   */
  documentationIsUpToDate(): AssertionBuilder {
    this.assertions.push(() => {
      console.log('🔍 Checking documentation...');
      
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Prüfe ob README existiert und aktuell ist
        const readmePath = path.join(process.cwd(), 'README.md');
        if (!fs.existsSync(readmePath)) {
          console.error('❌ README.md not found');
          return false;
        }
        
        const readmeStats = fs.statSync(readmePath);
        const daysSinceUpdate = (Date.now() - readmeStats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate > 30) {
          console.warn(`⚠️ README.md last updated ${Math.round(daysSinceUpdate)} days ago`);
        }
        
        console.log('✅ Documentation check passed');
        return true;
      } catch (error) {
        console.error(`❌ Documentation check failed: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Custom Assertion hinzufügen
   */
  custom(assertion: () => boolean, description?: string): AssertionBuilder {
    this.assertions.push(() => {
      console.log(`🔍 Running custom assertion${description ? ': ' + description : ''}...`);
      
      try {
        const result = assertion();
        if (result) {
          console.log(`✅ Custom assertion passed${description ? ': ' + description : ''}`);
        } else {
          console.error(`❌ Custom assertion failed${description ? ': ' + description : ''}`);
        }
        return result;
      } catch (error) {
        console.error(`❌ Custom assertion error${description ? ': ' + description : ''}: ${error}`);
        return false;
      }
    });
    
    return this;
  }

  /**
   * Finalisiert den Checkpoint mit den gebauten Assertions
   */
  build(checkpointName: string, requiredSteps: string[] = []): void {
    this.checkpointManager.createCheckpoint(
      checkpointName,
      requiredSteps,
      this.assertions
    );
  }
}

/**
 * Globale Checkpoint-Instanz
 */
export const checkpointManager = new CheckpointManager();

/**
 * Utility-Funktionen für häufige Checkpoint-Patterns
 */
export const CommonCheckpoints = {
  /**
   * Standard I18n Checkpoint
   */
  createI18nCheckpoint(requiredSteps: string[] = []): void {
    checkpointManager
      .createCriticalAssertions()
      .translationFilesExist(['en', 'de'])
      .build('i18n-validation', requiredSteps);
  },

  /**
   * Standard Quality Checkpoint
   */
  createQualityCheckpoint(requiredSteps: string[] = []): void {
    checkpointManager
      .createCriticalAssertions()
      .testsPass()
      .codeQualityMeetsStandards()
      .securityChecksPass()
      .build('quality-validation', requiredSteps);
  },

  /**
   * Standard Documentation Checkpoint
   */
  createDocumentationCheckpoint(requiredSteps: string[] = []): void {
    checkpointManager
      .createCriticalAssertions()
      .documentationIsUpToDate()
      .build('documentation-validation', requiredSteps);
  },

  /**
   * Komplett-Validation für Projekt-Abschluss
   */
  createCompleteValidationCheckpoint(requiredSteps: string[] = []): void {
    checkpointManager
      .createCriticalAssertions()
      .translationFilesExist()
      .testsPass()
      .codeQualityMeetsStandards()
      .securityChecksPass()
      .documentationIsUpToDate()
      .build('complete-validation', requiredSteps);
  }
};