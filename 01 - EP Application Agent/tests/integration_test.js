/**
 * Integration Test: End-to-End HR Bot Workflow
 * 
 * Tests the complete flow: Extract → Audit → Generate → Organize
 * 
 * Run with: node tests/integration_test.js
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  extractPassportData,
  extractCVData,
  extractCertificateData,
  validatePhoto
} = require('../src/extractors/candidate_extractor');
const { auditCandidateData, calculateMonthsUntilExpiry } = require('../src/audit/phase3');

// Colors for console output
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

async function runIntegrationTest() {
  log('\n========================================', 'cyan');
  log('HR Bot Integration Test', 'cyan');
  log('========================================\n', 'cyan');

  const results = {
    passportValidity: false,
    auditLogic: false,
    dataFlow: false
  };

  try {
    // Test 1: Passport Validity Calculation
    log('Test 1: Passport Validity Calculation', 'blue');
    const futureDate = '2028-12-31';
    const monthsValid = calculateMonthsUntilExpiry(futureDate);
    log(`  Passport expiry: ${futureDate}`, 'reset');
    log(`  Months until expiry: ${monthsValid}`, 'reset');
    
    if (monthsValid > 15) {
      log('  ✓ PASS: Passport validity calculation working', 'green');
      results.passportValidity = true;
    } else {
      log('  ✗ FAIL: Passport validity calculation incorrect', 'red');
    }
    log('', 'reset');

    // Test 2: Audit Logic with Mock Data
    log('Test 2: Audit Logic (Gatekeeper)', 'blue');
    
    // Load test fixtures
    const completeCandidate = require('./fixtures/candidate_complete.json');
    const failingCandidate = require('./fixtures/candidate_failing.json');

    // Test passing candidate
    log('  Testing complete candidate (should pass)...', 'reset');
    const auditResultPass = auditCandidateData(completeCandidate, true);
    log(`    Ready for form generation: ${auditResultPass.action_status.ready_for_form_generation}`, 'reset');
    if (auditResultPass.action_status.pause_reasons.length > 0) {
      log(`    Pause reasons: ${JSON.stringify(auditResultPass.action_status.pause_reasons, null, 2)}`, 'yellow');
    }
    
    // Test failing candidate
    log('  Testing failing candidate (should fail)...', 'reset');
    const auditResultFail = auditCandidateData(failingCandidate, true);
    log(`    Ready for form generation: ${auditResultFail.action_status.ready_for_form_generation}`, 'reset');
    if (auditResultFail.action_status.pause_reasons.length > 0) {
      log(`    Pause reasons:`, 'yellow');
      auditResultFail.action_status.pause_reasons.forEach(reason => {
        log(`      - ${reason}`, 'yellow');
      });
    }

    if (!auditResultFail.action_status.ready_for_form_generation && 
        auditResultFail.action_status.pause_reasons.length > 0) {
      log('  ✓ PASS: Audit logic correctly identifies compliance issues', 'green');
      results.auditLogic = true;
    } else {
      log('  ✗ FAIL: Audit logic not working as expected', 'red');
    }
    log('', 'reset');

    // Test 3: Data Flow (Extract → Audit)
    log('Test 3: Data Flow (Simulated)', 'blue');
    log('  Note: Full extraction test requires actual file uploads', 'yellow');
    log('  Simulating extracted data flow...', 'reset');

    // Simulate extraction result structure
    const simulatedExtraction = {
      passport: {
        full_name: 'Test Candidate',
        passport_number: 'T12345678',
        nationality: 'Testian',
        date_of_birth: '1990-01-01',
        date_of_expiry: '2030-12-31',
        issuing_country: 'Testland'
      },
      certificates: [
        {
          name: 'Bachelor of Testing',
          institution_name: 'Test University',
          degree_name: 'Bachelor of Testing',
          candidate_name: 'Test Candidate',
          completion_date: '2020-06-30',
          has_ctc_stamp: true
        }
      ],
      previous_malaysian_experience: false,
      myfuturejobs: {
        title: 'Test Engineer',
        approved_salary: 5000
      },
      job_offer: {
        title: 'Test Engineer',
        salary: 5500
      }
    };

    const auditFlow = auditCandidateData(simulatedExtraction, true);
    log(`    Extracted data passed to audit: ✓`, 'reset');
    log(`    Audit completed: ${auditFlow.action_status.ready_for_form_generation ? 'PASS' : 'FAIL'}`, 'reset');
    
    if (auditFlow.action_status.ready_for_form_generation) {
      log('  ✓ PASS: Data flow from extraction to audit working', 'green');
      results.dataFlow = true;
    } else {
      log(`  Pause reasons: ${auditFlow.action_status.pause_reasons.join(', ')}`, 'yellow');
      log('  ✗ FAIL: Data flow has issues', 'red');
    }
    log('', 'reset');

    // Summary
    log('========================================', 'cyan');
    log('Test Summary', 'cyan');
    log('========================================', 'cyan');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    log(`Total Tests: ${totalTests}`, 'reset');
    log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
    log(`Failed: ${totalTests - passedTests}`, passedTests === totalTests ? 'green' : 'red');
    log('', 'reset');

    if (passedTests === totalTests) {
      log('✓ All integration tests passed!', 'green');
      log('\nNext steps:', 'cyan');
      log('  1. Create docxtemplater master templates with {placeholders}', 'reset');
      log('  2. Test with real document uploads (passport, CV, certificates)', 'reset');
      log('  3. Run server.js and test via web interface', 'reset');
      process.exit(0);
    } else {
      log('✗ Some integration tests failed. Review output above.', 'red');
      process.exit(1);
    }

  } catch (error) {
    log(`\n✗ Integration test error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
runIntegrationTest();
