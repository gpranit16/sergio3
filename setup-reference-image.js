const fs = require('fs');
const path = require('path');

console.log('=== Setting up Reference Aadhaar for Nikhil Kumar ===\n');

// Create reference directory
const referenceDir = path.join(__dirname, 'lib', 'reference_documents');
if (!fs.existsSync(referenceDir)) {
  fs.mkdirSync(referenceDir, { recursive: true });
  console.log('✓ Created reference directory');
} else {
  console.log('✓ Reference directory exists');
}

// Copy reference Aadhaar
const possibleSources = [
  'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1765474763994.jpg',
  'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765473391488.jpg',
];

const destFile = path.join(referenceDir, 'nikhil_kumar_aadhaar.jpg');

for (const source of possibleSources) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, destFile);
    const stats = fs.statSync(destFile);
    console.log('✓ Copied reference Aadhaar from:', path.basename(source));
    console.log('✓ File size:', stats.size, 'bytes');
    console.log('\n✅ Setup complete! Reference Aadhaar is ready.');
    console.log('   Location:', destFile);
    process.exit(0);
  }
}

console.error('✗ Could not find reference image');
console.error('  Please ensure the Nikhil Kumar Aadhaar image is available');
process.exit(1);
