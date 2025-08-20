#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load performance budgets
const budgetsPath = path.join(__dirname, '..', 'performance-budgets.json');
const budgets = JSON.parse(fs.readFileSync(budgetsPath, 'utf8'));

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function formatSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function checkBundleSize() {
  console.log(`\n${colors.cyan}${colors.bold}📦 Checking Bundle Sizes...${colors.reset}`);
  
  const buildDir = path.join(__dirname, '..', 'build', 'static');
  
  if (!fs.existsSync(buildDir)) {
    console.log(`${colors.yellow}⚠️  Build directory not found. Run 'npm run build' first.${colors.reset}`);
    return false;
  }
  
  let totalSize = 0;
  let hasErrors = false;
  const results = [];
  
  // Check JS bundles
  const jsDir = path.join(buildDir, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    
    jsFiles.forEach(file => {
      const stats = fs.statSync(path.join(jsDir, file));
      const sizeKB = stats.size / 1024;
      totalSize += sizeKB;
      
      let status = '✅';
      let color = colors.green;
      
      if (file.includes('main')) {
        if (sizeKB > budgets.budgets['bundle-sizes'].main.error) {
          status = '❌';
          color = colors.red;
          hasErrors = true;
        } else if (sizeKB > budgets.budgets['bundle-sizes'].main.warning) {
          status = '⚠️';
          color = colors.yellow;
        }
      }
      
      results.push({
        file: `js/${file}`,
        size: formatSize(stats.size),
        sizeKB,
        status,
        color
      });
    });
  }
  
  // Check CSS bundles
  const cssDir = path.join(buildDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    
    cssFiles.forEach(file => {
      const stats = fs.statSync(path.join(cssDir, file));
      const sizeKB = stats.size / 1024;
      totalSize += sizeKB;
      
      let status = '✅';
      let color = colors.green;
      
      if (sizeKB > budgets.budgets['bundle-sizes'].css.error) {
        status = '❌';
        color = colors.red;
        hasErrors = true;
      } else if (sizeKB > budgets.budgets['bundle-sizes'].css.warning) {
        status = '⚠️';
        color = colors.yellow;
      }
      
      results.push({
        file: `css/${file}`,
        size: formatSize(stats.size),
        sizeKB,
        status,
        color
      });
    });
  }
  
  // Display results
  console.log('\nBundle Analysis:');
  results.forEach(r => {
    console.log(`  ${r.status} ${r.color}${r.file}: ${r.size}${colors.reset}`);
  });
  
  // Check total size
  const totalBudget = budgets.budgets['bundle-sizes'].total;
  let totalStatus = '✅';
  let totalColor = colors.green;
  
  if (totalSize > totalBudget.error) {
    totalStatus = '❌';
    totalColor = colors.red;
    hasErrors = true;
  } else if (totalSize > totalBudget.warning) {
    totalStatus = '⚠️';
    totalColor = colors.yellow;
  }
  
  console.log(`\n${totalStatus} ${totalColor}Total Bundle Size: ${formatSize(totalSize * 1024)}${colors.reset}`);
  console.log(`  Target: ${totalBudget.target}KB | Warning: ${totalBudget.warning}KB | Error: ${totalBudget.error}KB`);
  
  return !hasErrors;
}

function checkDependencies() {
  console.log(`\n${colors.cyan}${colors.bold}🔍 Checking Dependencies...${colors.reset}`);
  
  try {
    // Check for outdated packages
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    const outdatedPackages = outdated ? JSON.parse(outdated) : {};
    
    if (Object.keys(outdatedPackages).length > 0) {
      console.log(`${colors.yellow}⚠️  Found ${Object.keys(outdatedPackages).length} outdated packages${colors.reset}`);
      Object.entries(outdatedPackages).slice(0, 5).forEach(([name, info]) => {
        console.log(`  - ${name}: ${info.current} → ${info.latest}`);
      });
    } else {
      console.log(`${colors.green}✅ All dependencies are up to date${colors.reset}`);
    }
  } catch (e) {
    // npm outdated returns non-zero exit code when packages are outdated
    if (e.stdout) {
      try {
        const outdatedPackages = JSON.parse(e.stdout);
        console.log(`${colors.yellow}⚠️  Found ${Object.keys(outdatedPackages).length} outdated packages${colors.reset}`);
      } catch {
        console.log(`${colors.green}✅ Dependencies check completed${colors.reset}`);
      }
    }
  }
  
  // Check for security vulnerabilities
  try {
    const audit = execSync('npm audit --json', { encoding: 'utf8' });
    const auditResult = JSON.parse(audit);
    
    if (auditResult.metadata.vulnerabilities.total > 0) {
      const vulns = auditResult.metadata.vulnerabilities;
      console.log(`\n${colors.red}🔒 Security Vulnerabilities Found:${colors.reset}`);
      console.log(`  Critical: ${vulns.critical} | High: ${vulns.high} | Medium: ${vulns.moderate} | Low: ${vulns.low}`);
      return false;
    } else {
      console.log(`${colors.green}✅ No security vulnerabilities found${colors.reset}`);
    }
  } catch (e) {
    console.log(`${colors.yellow}⚠️  Could not check security vulnerabilities${colors.reset}`);
  }
  
  return true;
}

function generateReport() {
  console.log(`\n${colors.cyan}${colors.bold}📊 Performance Budget Report${colors.reset}`);
  console.log('═'.repeat(50));
  
  const bundleSizeOk = checkBundleSize();
  const depsOk = checkDependencies();
  
  console.log('\n' + '═'.repeat(50));
  
  if (bundleSizeOk && depsOk) {
    console.log(`${colors.green}${colors.bold}✅ All performance checks passed!${colors.reset}`);
    return 0;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Some performance checks failed${colors.reset}`);
    console.log(`\n${colors.yellow}Recommendations:${colors.reset}`);
    
    if (!bundleSizeOk) {
      console.log('  • Run code splitting to reduce bundle sizes');
      console.log('  • Use dynamic imports for large components');
      console.log('  • Optimize images and assets');
    }
    
    if (!depsOk) {
      console.log('  • Update outdated dependencies');
      console.log('  • Run npm audit fix for security issues');
    }
    
    return 1;
  }
}

// Run the checks
process.exit(generateReport());