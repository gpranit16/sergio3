const fs = require('fs');

// Check the uploaded PAN card file size
const panPath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1765478674529.jpg';

if (fs.existsSync(panPath)) {
  const buffer = fs.readFileSync(panPath);
  const firstBytes = buffer.slice(0, 4).toString('hex');
  const lastBytes = buffer.slice(-4).toString('hex');
  
  console.log('PAN Card File Info:');
  console.log('Size:', buffer.length, 'bytes');
  console.log('First 4 bytes:', firstBytes);
  console.log('Last 4 bytes:', lastBytes);
} else {
  console.log('PAN card file not found');
}
