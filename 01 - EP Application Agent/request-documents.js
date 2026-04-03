#!/usr/bin/env node

/**
 * Document Request Handler for EP Applications
 * 
 * This script helps you quickly gather and send required documents
 * when requested by immigration agencies or processing partners.
 * 
 * Usage:
 *   node request-documents.js [document-type]
 * 
 * Examples:
 *   node request-documents.js passport
 *   node request-documents.js certificates
 *   node request-documents.js all
 */

const fs = require('fs').promises;
const path = require('path');

// Document categories based on typical EP application requirements
const DOCUMENT_CATEGORIES = {
  'passport': {
    name: 'Passport Documents',
    files: [
      'Passport Copy.pdf',
      'Passport Picture.jpg',
      'Passport Pages.pdf'
    ],
    source: 'Archive/Reference Documents/temp_docs/',
    description: 'Passport copies and photos'
  },
  
  'certificates': {
    name: 'Educational Certificates',
    files: [
      'Degree Certificate.pdf',
      'Transcript.pdf',
      'CTC Academic Documents.pdf'
    ],
    source: 'Archive/Reference Documents/temp_docs/Documents to Submit/',
    description: 'Educational certificates and transcripts'
  },
  
  'cv': {
    name: 'CV/Resume',
    files: [
      'CV.pdf',
      'Resume.pdf'
    ],
    source: 'Archive/Reference Documents/temp_docs/Documents to Submit/',
    description: 'Curriculum Vitae / Resume'
  },
  
  'company': {
    name: 'Company Documents',
    files: [
      'SSM Certificate.pdf',
      'Company Profile.pdf',
      'DBKL License.pdf'
    ],
    source: 'Archive/Reference Documents/',
    description: 'Company registration and licenses'
  },
  
  'jtksm': {
    name: 'JTKSM/PERKESO Forms',
    files: [
      'JTKSM Report.docx',
      'Laporan Pengambilan.docx'
    ],
    source: 'Output/',
    description: 'JTKSM and PERKESO forms'
  },
  
  'checklist': {
    name: 'GP Checklist',
    files: [
      'GP Checklist.docx',
      'Document Checklist.pdf'
    ],
    source: 'Output/',
    description: 'Document verification checklist'
  },
  
  'all': {
    name: 'All Documents',
    files: [],
    source: 'multiple',
    description: 'Complete document package for EP application'
  }
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function findDocuments(category) {
  const categoryConfig = DOCUMENT_CATEGORIES[category.toLowerCase()];
  
  if (!categoryConfig) {
    log(`\n❌ Category not found: ${category}`, 'red');
    log('\nAvailable categories:', 'yellow');
    Object.keys(DOCUMENT_CATEGORIES).forEach(cat => {
      log(`  - ${cat}: ${DOCUMENT_CATEGORIES[cat].name}`, 'cyan');
    });
    return [];
  }
  
  log(`\n📄 Searching for: ${categoryConfig.name}`, 'blue');
  log(`Description: ${categoryConfig.description}\n`, 'reset');
  
  const found = [];
  const baseDir = path.join(__dirname, '..');
  
  if (category === 'all') {
    // Search all categories
    for (const [catKey, catConfig] of Object.entries(DOCUMENT_CATEGORIES)) {
      if (catKey !== 'all') {
        const results = await findDocuments(catKey);
        found.push(...results);
      }
    }
  } else {
    // Search specific category
    const searchDir = path.join(baseDir, categoryConfig.source);
    
    try {
      await fs.access(searchDir);
    } catch (error) {
      log(`⚠️  Source directory not found: ${searchDir}`, 'yellow');
      log('   Documents may be in Archive folder', 'yellow');
      return [];
    }
    
    for (const fileName of categoryConfig.files) {
      const filePath = path.join(searchDir, fileName);
      try {
        await fs.access(filePath);
        found.push({
          name: fileName,
          path: filePath,
          category: categoryConfig.name
        });
        log(`  ✓ Found: ${fileName}`, 'green');
      } catch (error) {
        // File not found, try in archive
        const archivePath = path.join(baseDir, 'Archive/Reference Documents', fileName);
        try {
          await fs.access(archivePath);
          found.push({
            name: fileName,
            path: archivePath,
            category: categoryConfig.name,
            inArchive: true
          });
          log(`  ✓ Found (Archive): ${fileName}`, 'yellow');
        } catch (e) {
          log(`  ✗ Not found: ${fileName}`, 'red');
        }
      }
    }
  }
  
  return found;
}

async function createDocumentPackage(documents, packageName = 'EP_Application_Documents') {
  if (documents.length === 0) {
    log('\n⚠️  No documents to package', 'yellow');
    return;
  }
  
  log(`\n📦 Creating document package...`, 'blue');
  
  const outputDir = path.join(__dirname, '..', 'Output', 'Document_Packages');
  await fs.mkdir(outputDir, { recursive: true });
  
  const packageInfo = [];
  packageInfo.push('DOCUMENT PACKAGE');
  packageInfo.push('==================');
  packageInfo.push(`Created: ${new Date().toISOString()}`);
  packageInfo.push(`Total Documents: ${documents.length}`);
  packageInfo.push('');
  packageInfo.push('Documents:');
  packageInfo.push('------------');
  
  documents.forEach((doc, index) => {
    packageInfo.push(`${index + 1}. ${doc.name}`);
    packageInfo.push(`   Category: ${doc.category}`);
    packageInfo.push(`   Location: ${doc.path}`);
    packageInfo.push(`   Archive: ${doc.inArchive ? 'Yes' : 'No'}`);
    packageInfo.push('');
  });
  
  const infoPath = path.join(outputDir, `${packageName}_INDEX.txt`);
  await fs.writeFile(infoPath, packageInfo.join('\n'));
  
  log(`\n✅ Package index created: ${infoPath}`, 'green');
  log('\n📋 To send these documents:', 'cyan');
  log('  1. Review the index file above', 'reset');
  log('  2. Copy the listed files to a USB drive or email', 'reset');
  log('  3. Include the index file in your email', 'reset');
  log('', 'reset');
}

async function main() {
  const category = process.argv[2] || 'all';
  
  log('\n========================================', 'cyan');
  log('EP Application - Document Request Handler', 'cyan');
  log('========================================\n', 'cyan');
  
  const documents = await findDocuments(category);
  
  if (documents.length > 0) {
    log(`\n✅ Found ${documents.length} document(s)`, 'green');
    await createDocumentPackage(documents);
  } else {
    log('\n⚠️  No documents found', 'yellow');
    log('\nTip: Check Archive/Reference Documents/ folder', 'yellow');
  }
}

main().catch(console.error);
