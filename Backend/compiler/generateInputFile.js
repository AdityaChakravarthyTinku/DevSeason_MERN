const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// Directories for different languages
const directories = {
  cpp: path.join(__dirname, 'cppInputs'),
  java: path.join(__dirname, 'javaInputs'),
  c: path.join(__dirname, 'cInputs'),
  py: path.join(__dirname, 'pyInputs')
};

Object.values(directories).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

exports.generateInputFile = (language, input) => {
  const dirCodes = directories[language]; // Get the directory based on the language
  const inputfileID = uuid();
  const inputfilePath = path.join(dirCodes, `${inputfileID}.txt`);
  fs.writeFileSync(inputfilePath, input);
  return inputfilePath;
};
