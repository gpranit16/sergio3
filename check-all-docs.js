const fs = require('fs');

const files = [
  'c:\\Users\\gupta\\Downloads\\bankingg\\bank-main\\public\\uploads\\pan.png',
  'c:\\Users\\gupta\\Downloads\\bankingg\\bank-main\\public\\uploads\\selfie.png',
  'c:\\Users\\gupta\\Downloads\\bankingg\\bank-main\\public\\uploads\\salary-slip.jpg',
  'c:\\Users\\gupta\\Downloads\\bankingg\\bank-main\\public\\uploads\\bank-statement.png',
  'c:\\Users\\gupta\\Downloads\\bankingg\\bank-main\\public\\uploads\\aadhaar.png'
];

files.forEach(file => {
  try {
    const stats = fs.statSync(file);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`${file.split('\\').pop()}: ${stats.size} bytes (${sizeInMB} MB)`);
  } catch (err) {
    console.log(`${file.split('\\').pop()}: File not found`);
  }
});
