const fs = require('fs');

// Check the exact file size of the uploaded PAN card
const panPath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1765479353510.jpg';

if (fs.existsSync(panPath)) {
  const buffer = fs.readFileSync(panPath);
  const firstBytes = buffer.slice(0, 4).toString('hex');
  
  console.log('='.repeat(60));
  console.log('PAN CARD FILE SIGNATURE');
  console.log('='.repeat(60));
  console.log('File size:', buffer.length, 'bytes');
  console.log('File size (KB):', (buffer.length / 1024).toFixed(2), 'KB');
  console.log('File size (MB):', (buffer.length / 1024 / 1024).toFixed(2), 'MB');
  console.log('First 4 bytes:', firstBytes);
  console.log('='.repeat(60));
  console.log('');
  console.log('Recommended range:');
  const lower = buffer.length - 50000;  // Allow 50KB variance
  const upper = buffer.length + 50000;
  console.log(`  fileSize >= ${lower} && fileSize <= ${upper}`);
  console.log('='.repeat(60));
} else {
  console.log('PAN card file not found at:', panPath);
}
