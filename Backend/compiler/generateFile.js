const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// Directories for different languages
const directories = {
  cpp: path.join(__dirname, 'cppCodes'),
  java: path.join(__dirname, 'javaCodes'),
  c: path.join(__dirname, 'cCodes'),
  py: path.join(__dirname, 'pyCodes')
};

Object.values(directories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

exports.generateFile = (language, code) => {
  const dirCodes = directories[language]; // Get the directory based on the language
  const fileID = uuid();
  const filePath = path.join(dirCodes, `${fileID}.${language}`);
  console.log(`Creating file at: ${filePath}`);

  fs.writeFileSync(filePath, code);
  console.log(`File created at: ${filePath}`);




  return filePath;
};
