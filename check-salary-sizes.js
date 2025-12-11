const fs = require('fs');

const files = [
  'C:/Users/gupta/.gemini/antigravity/brain/e174baa6-3b18-4d72-8286-413ed023e882/uploaded_image_0_1765484876399.jpg',
  'C:/Users/gupta/.gemini/antigravity/brain/e174baa6-3b18-4d72-8286-413ed023e882/uploaded_image_1_1765484876399.png'
];

console.log('Checking salary slip file sizes:\n');

files.forEach(file => {
  try {
    const stats = fs.statSync(file);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(3);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    const extension = file.split('.').pop().toUpperCase();
    console.log(`${extension} version:`);
    console.log(`  Size: ${stats.size} bytes`);
    console.log(`  Size: ${sizeInKB} KB`);
    console.log(`  Size: ${sizeInMB} MB\n`);
  } catch (err) {
    console.log(`Error reading ${file}: ${err.message}\n`);
  }
});
