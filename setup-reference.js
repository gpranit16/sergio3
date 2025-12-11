const fs = require('fs');
const path = require('path');

console.log('=== Setting up Reference Aadhaar Document ===\n');

// Create reference_documents directory
const referenceDir = path.join(__dirname, 'lib', 'reference_documents');
console.log('1. Creating directory:', referenceDir);

if (!fs.existsSync(referenceDir)) {
  fs.mkdirSync(referenceDir, { recursive: true });
  console.log('   ✓ Directory created');
} else {
  console.log('   ✓ Directory already exists');
}

// Copy reference Aadhaar card
const sourceFile = path.join('C:', 'Users', 'gupta', '.gemini', 'antigravity', 'brain', 'e174baa6-3b18-4d72-8286-413ed023e882', 'uploaded_image_1_1765472534442.jpg');
const destFile = path.join(referenceDir, 'nikhil_kumar_aadhaar.jpg');

console.log('\n2. Copying reference Aadhaar...');
console.log('   Source:', sourceFile);
console.log('   Destination:', destFile);

try {
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    const stats = fs.statSync(destFile);
    console.log('   ✓ File copied successfully');
    console.log('   ✓ File size:', stats.size, 'bytes');
    
    // Verify the file is readable
    const buffer = fs.readFileSync(destFile);
    console.log('   ✓ File is readable');
    console.log('   ✓ Buffer size:', buffer.length, 'bytes');
    
    console.log('\n✅ Setup complete! Reference document is ready.');
    console.log('\nYou can now test the verification again.');
  } else {
    console.error('   ✗ Source file not found:', sourceFile);
    console.log('\nTrying alternate source...');
    
    const altSource = path.join('C:', 'Users', 'gupta', '.gemini', 'antigravity', 'brain', 'e174baa6-3b18-4d72-8286-413ed023e882', 'uploaded_image_1_1765470954904.jpg');
    console.log('   Alternate source:', altSource);
    
    if (fs.existsSync(altSource)) {
      fs.copyFileSync(altSource, destFile);
      const stats = fs.statSync(destFile);
      console.log('   ✓ File copied from alternate source');
      console.log('   ✓ File size:', stats.size, 'bytes');
      console.log('\n✅ Setup complete! Reference document is ready.');
    } else {
      console.error('   ✗ Alternate source also not found');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('\n✗ Error:', error.message);
  process.exit(1);
}
