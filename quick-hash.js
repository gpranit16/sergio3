const fs = require('fs');
const crypto = require('crypto');

// Read the genuine Nikhil Kumar Aadhaar
const imagePath = 'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765476810214.jpg';

if (fs.existsSync(imagePath)) {
  const buffer = fs.readFileSync(imagePath);
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  const size = buffer.length;
  const fingerprint = `${hash.substring(0, 16)}-${size}`;
  
  console.log('Hash:', hash);
  console.log('Fingerprint:', fingerprint);
  console.log('Size:', size);
} else {
  console.log('File not found');
}
