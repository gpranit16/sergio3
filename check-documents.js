const fs = require('fs');

// Check both document file sizes
const salarySlipPath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_0_1765484044136.jpg';
const bankStatementPath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765484044136.jpg';

console.log('='.repeat(60));
console.log('DOCUMENT FILE SIGNATURES');
console.log('='.repeat(60));

if (fs.existsSync(salarySlipPath)) {
  const buffer = fs.readFileSync(salarySlipPath);
  const firstBytes = buffer.slice(0, 4).toString('hex');
  
  console.log('\n📄 SALARY SLIP:');
  console.log('  File size:', buffer.length, 'bytes');
  console.log('  File size (KB):', (buffer.length / 1024).toFixed(2), 'KB');
  console.log('  File size (MB):', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('  First 4 bytes:', firstBytes);
} else {
  console.log('\n❌ Salary slip file not found');
}

if (fs.existsSync(bankStatementPath)) {
  const buffer = fs.readFileSync(bankStatementPath);
  const firstBytes = buffer.slice(0, 4).toString('hex');
  
  console.log('\n🏦 BANK STATEMENT:');
  console.log('  File size:', buffer.length, 'bytes');
  console.log('  File size (KB):', (buffer.length / 1024).toFixed(2), 'KB');
  console.log('  File size (MB):', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('  First 4 bytes:', firstBytes);
} else {
  console.log('\n❌ Bank statement file not found');
}

console.log('\n' + '='.repeat(60));
