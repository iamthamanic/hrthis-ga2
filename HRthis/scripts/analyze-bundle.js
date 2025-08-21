#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the webpack bundle size and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Size thresholds (in KB)
const THRESHOLDS = {
  totalBundle: 500,    // 500KB for total bundle
  mainChunk: 250,      // 250KB for main chunk
  lazyChunk: 100,      // 100KB for lazy-loaded chunks
  cssBundle: 50,       // 50KB for CSS
  warning: 0.8,        // 80% of limit triggers warning
  critical: 1.0,       // 100% of limit triggers error
};

class BundleAnalyzer {
  constructor() {
    this.buildPath = path.join(__dirname, '..', 'build');
    this.staticPath = path.join(this.buildPath, 'static');
    this.results = {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      mediaSize: 0,
      chunks: [],
      recommendations: [],
      score: 100,
    };
  }

  /**
   * Run the bundle analysis
   */
  async analyze() {
    console.log(`${colors.cyan}🔍 Starting Bundle Analysis...${colors.reset}\n`);

    // Check if build exists
    if (!fs.existsSync(this.buildPath)) {
      console.log(`${colors.yellow}⚠️  No build found. Running build first...${colors.reset}`);
      this.runBuild();
    }

    // Analyze bundle
    this.analyzeStaticFiles();
    this.analyzeChunks();
    this.calculateScore();
    this.generateRecommendations();
    
    // Print results
    this.printResults();
    
    // Generate detailed report
    this.generateReport();

    return this.results;
  }

  /**
   * Run build command
   */
  runBuild() {
    console.log(`${colors.blue}📦 Building production bundle...${colors.reset}`);
    try {
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log(`${colors.green}✅ Build completed successfully${colors.reset}\n`);
    } catch (error) {
      console.error(`${colors.red}❌ Build failed: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  }

  /**
   * Analyze static files
   */
  analyzeStaticFiles() {
    const jsPath = path.join(this.staticPath, 'js');
    const cssPath = path.join(this.staticPath, 'css');
    const mediaPath = path.join(this.staticPath, 'media');

    // Analyze JS files
    if (fs.existsSync(jsPath)) {
      const jsFiles = fs.readdirSync(jsPath);
      jsFiles.forEach(file => {
        const stats = fs.statSync(path.join(jsPath, file));
        const sizeKB = stats.size / 1024;
        
        this.results.jsSize += sizeKB;
        this.results.chunks.push({
          name: file,
          type: 'js',
          size: sizeKB,
          gzipSize: this.estimateGzipSize(sizeKB),
        });
      });
    }

    // Analyze CSS files
    if (fs.existsSync(cssPath)) {
      const cssFiles = fs.readdirSync(cssPath);
      cssFiles.forEach(file => {
        const stats = fs.statSync(path.join(cssPath, file));
        const sizeKB = stats.size / 1024;
        
        this.results.cssSize += sizeKB;
        this.results.chunks.push({
          name: file,
          type: 'css',
          size: sizeKB,
          gzipSize: this.estimateGzipSize(sizeKB),
        });
      });
    }

    // Analyze media files
    if (fs.existsSync(mediaPath)) {
      const mediaFiles = fs.readdirSync(mediaPath);
      mediaFiles.forEach(file => {
        const stats = fs.statSync(path.join(mediaPath, file));
        const sizeKB = stats.size / 1024;
        this.results.mediaSize += sizeKB;
      });
    }

    this.results.totalSize = this.results.jsSize + this.results.cssSize + this.results.mediaSize;
  }

  /**
   * Analyze individual chunks
   */
  analyzeChunks() {
    // Sort chunks by size
    this.results.chunks.sort((a, b) => b.size - a.size);

    // Identify main chunk
    const mainChunk = this.results.chunks.find(chunk => 
      chunk.name.includes('main') && chunk.type === 'js'
    );

    if (mainChunk) {
      this.results.mainChunkSize = mainChunk.size;
    }

    // Identify vendor chunks
    const vendorChunks = this.results.chunks.filter(chunk => 
      chunk.name.includes('vendor') || chunk.name.match(/^\d+\./)
    );

    if (vendorChunks.length > 0) {
      this.results.vendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    }
  }

  /**
   * Calculate bundle score
   */
  calculateScore() {
    let score = 100;

    // Check total bundle size
    if (this.results.totalSize > THRESHOLDS.totalBundle) {
      const excess = (this.results.totalSize - THRESHOLDS.totalBundle) / THRESHOLDS.totalBundle;
      score -= Math.min(30, excess * 30);
    }

    // Check main chunk size
    if (this.results.mainChunkSize > THRESHOLDS.mainChunk) {
      const excess = (this.results.mainChunkSize - THRESHOLDS.mainChunk) / THRESHOLDS.mainChunk;
      score -= Math.min(25, excess * 25);
    }

    // Check CSS size
    if (this.results.cssSize > THRESHOLDS.cssBundle) {
      const excess = (this.results.cssSize - THRESHOLDS.cssBundle) / THRESHOLDS.cssBundle;
      score -= Math.min(15, excess * 15);
    }

    // Check number of chunks (too few means no code splitting)
    if (this.results.chunks.filter(c => c.type === 'js').length < 3) {
      score -= 10;
      this.results.recommendations.push({
        type: 'warning',
        message: 'Consider implementing code splitting for better performance',
      });
    }

    this.results.score = Math.max(0, Math.round(score));
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Check total bundle size
    if (this.results.totalSize > THRESHOLDS.totalBundle * THRESHOLDS.warning) {
      recommendations.push({
        type: this.results.totalSize > THRESHOLDS.totalBundle ? 'error' : 'warning',
        message: `Total bundle size (${this.formatSize(this.results.totalSize)}) exceeds recommended limit (${THRESHOLDS.totalBundle}KB)`,
        suggestion: 'Consider code splitting, tree shaking, and removing unused dependencies',
      });
    }

    // Check main chunk
    if (this.results.mainChunkSize > THRESHOLDS.mainChunk * THRESHOLDS.warning) {
      recommendations.push({
        type: this.results.mainChunkSize > THRESHOLDS.mainChunk ? 'error' : 'warning',
        message: `Main chunk size (${this.formatSize(this.results.mainChunkSize)}) is too large`,
        suggestion: 'Move more components to lazy-loaded routes',
      });
    }

    // Check for large dependencies
    const largeChunks = this.results.chunks.filter(chunk => 
      chunk.size > THRESHOLDS.lazyChunk && !chunk.name.includes('main')
    );

    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `Found ${largeChunks.length} large chunks (>100KB)`,
        suggestion: 'Consider splitting these chunks further or optimizing imports',
        details: largeChunks.map(c => `${c.name}: ${this.formatSize(c.size)}`),
      });
    }

    // Check CSS size
    if (this.results.cssSize > THRESHOLDS.cssBundle) {
      recommendations.push({
        type: 'warning',
        message: `CSS bundle (${this.formatSize(this.results.cssSize)}) is larger than recommended`,
        suggestion: 'Consider using CSS modules, removing unused styles, or using PurgeCSS',
      });
    }

    // Check for missing optimizations
    if (!this.results.chunks.some(c => c.name.includes('vendor'))) {
      recommendations.push({
        type: 'info',
        message: 'No vendor chunk detected',
        suggestion: 'Consider separating vendor libraries into a separate chunk for better caching',
      });
    }

    this.results.recommendations = recommendations;
  }

  /**
   * Print analysis results
   */
  printResults() {
    console.log(`${colors.bright}📊 Bundle Analysis Results${colors.reset}\n`);
    console.log('═'.repeat(50));

    // Score
    const scoreColor = this.results.score >= 80 ? colors.green : 
                      this.results.score >= 60 ? colors.yellow : colors.red;
    console.log(`${colors.bright}Score:${colors.reset} ${scoreColor}${this.results.score}/100${colors.reset}`);
    
    // Size summary
    console.log(`\n${colors.bright}📦 Bundle Sizes:${colors.reset}`);
    console.log(`  Total:      ${this.formatSizeWithColor(this.results.totalSize, THRESHOLDS.totalBundle)}`);
    console.log(`  JavaScript: ${this.formatSizeWithColor(this.results.jsSize, THRESHOLDS.totalBundle * 0.7)}`);
    console.log(`  CSS:        ${this.formatSizeWithColor(this.results.cssSize, THRESHOLDS.cssBundle)}`);
    console.log(`  Media:      ${this.formatSize(this.results.mediaSize)}`);
    
    // Main chunks
    console.log(`\n${colors.bright}📂 Main Chunks:${colors.reset}`);
    const topChunks = this.results.chunks.slice(0, 5);
    topChunks.forEach(chunk => {
      const threshold = chunk.name.includes('main') ? THRESHOLDS.mainChunk : THRESHOLDS.lazyChunk;
      console.log(`  ${chunk.name.padEnd(30)} ${this.formatSizeWithColor(chunk.size, threshold)} (gzip: ~${this.formatSize(chunk.gzipSize)})`);
    });

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log(`\n${colors.bright}💡 Recommendations:${colors.reset}`);
      this.results.recommendations.forEach(rec => {
        const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
        const color = rec.type === 'error' ? colors.red : rec.type === 'warning' ? colors.yellow : colors.blue;
        
        console.log(`\n  ${icon} ${color}${rec.message}${colors.reset}`);
        if (rec.suggestion) {
          console.log(`     ${colors.cyan}→ ${rec.suggestion}${colors.reset}`);
        }
        if (rec.details) {
          rec.details.forEach(detail => {
            console.log(`       • ${detail}`);
          });
        }
      });
    } else {
      console.log(`\n${colors.green}✅ Bundle is well optimized!${colors.reset}`);
    }

    console.log('\n' + '═'.repeat(50));
  }

  /**
   * Generate detailed JSON report
   */
  generateReport() {
    const reportPath = path.join(__dirname, '..', 'bundle-analysis.json');
    const report = {
      timestamp: new Date().toISOString(),
      score: this.results.score,
      sizes: {
        total: this.results.totalSize,
        javascript: this.results.jsSize,
        css: this.results.cssSize,
        media: this.results.mediaSize,
        mainChunk: this.results.mainChunkSize,
        vendor: this.results.vendorSize,
      },
      chunks: this.results.chunks,
      recommendations: this.results.recommendations,
      thresholds: THRESHOLDS,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${colors.cyan}bundle-analysis.json${colors.reset}`);
  }

  /**
   * Estimate gzip size (rough approximation)
   */
  estimateGzipSize(sizeKB) {
    // Rough estimate: gzip typically achieves 60-70% compression for JS/CSS
    return sizeKB * 0.35;
  }

  /**
   * Format size for display
   */
  formatSize(sizeKB) {
    if (sizeKB < 1) {
      return `${Math.round(sizeKB * 1024)}B`;
    } else if (sizeKB < 1024) {
      return `${Math.round(sizeKB)}KB`;
    } else {
      return `${(sizeKB / 1024).toFixed(2)}MB`;
    }
  }

  /**
   * Format size with color based on threshold
   */
  formatSizeWithColor(sizeKB, threshold) {
    const formatted = this.formatSize(sizeKB);
    if (sizeKB > threshold) {
      return `${colors.red}${formatted}${colors.reset}`;
    } else if (sizeKB > threshold * THRESHOLDS.warning) {
      return `${colors.yellow}${formatted}${colors.reset}`;
    } else {
      return `${colors.green}${formatted}${colors.reset}`;
    }
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().then(results => {
    // Exit with error code if score is too low
    if (results.score < 60) {
      process.exit(1);
    }
  }).catch(error => {
    console.error(`${colors.red}❌ Analysis failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = BundleAnalyzer;