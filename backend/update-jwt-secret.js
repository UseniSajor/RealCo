const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Generate new JWT secret
const secret = crypto.randomBytes(32).toString('hex');

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf-8');

// Replace JWT_SECRET line
envContent = envContent.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);

// Write back to .env
fs.writeFileSync(envPath, envContent, 'utf-8');

console.log(`✅ Generated and updated JWT_SECRET: ${secret}`);

