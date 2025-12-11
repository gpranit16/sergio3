const fs = require('fs');

// Check the selfie file size
const selfiePath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765480765746.png';

if (fs.existsSync(selfiePath)) {
  const buffer = fs.readFileSync(selfiePath);
  const firstBytes = buffer.slice(0, 4).toString('hex');
  
  console.log('='.repeat(60));
  console.log('SELFIE FILE SIGNATURE');
  console.log('='.repeat(60));
  console.log('File size:', buffer.length, 'bytes');
  console.log('File size (KB):', (buffer.length / 1024).toFixed(2), 'KB');
  console.log('First 4 bytes:', firstBytes);
  console.log('='.repeat(60));
} else {
  console.log('Selfie file not found');
}
