const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Output directories for different languages
const outputDirs = {
  c: path.join(__dirname, 'coutput'),
  cpp: path.join(__dirname, 'cppoutput'),
  java: path.join(__dirname, 'javaoutput'),
  py: path.join(__dirname, 'pyoutput')
};

// Ensure output directories exist
for (const dir in outputDirs) {
  if (!fs.existsSync(outputDirs[dir])) {
    fs.mkdirSync(outputDirs[dir], { recursive: true });
  }
}

// Function to execute code
exports.execute = (language, filePath, inputFilePath) => {
  const fileId = path.basename(filePath).split(".")[0];
  let outputFilePath = path.join(outputDirs[language], fileId);

  let command;
  switch (language) {
    case 'c':
      command = `gcc "${filePath}" -o "${outputFilePath}.exe" && cd "${outputDirs.c}" && .\\${fileId}.exe < "${inputFilePath}"`;
      break;
    case 'cpp':
      command = `g++ "${filePath}" -o "${outputFilePath}.exe" && cd "${outputDirs.cpp}" && .\\${fileId}.exe < "${inputFilePath}"`;
      break;
    case 'java':
      const javaCode = fs.readFileSync(filePath, 'utf-8');
      const classNameMatch = javaCode.match(/public\s+class\s+(\w+)/);
      if (!classNameMatch) {
        throw new Error('Could not find public class declaration in Java code.');
      }
      const className = classNameMatch[1];

      const javaFileName = `${className}.java`;
      const newJavaFilePath = path.join(outputDirs.java, javaFileName);

      console.log(`Copying file from ${filePath} to ${newJavaFilePath}`);
      fs.copyFileSync(filePath, newJavaFilePath);

      command = `javac "${newJavaFilePath}" -d "${outputDirs.java}" && cd "${outputDirs.java}" && java ${className} < "${inputFilePath}"`;
      break;
    case 'py':
      command = `python "${filePath}" < "${inputFilePath}"`;
      break;
    default:
      return Promise.reject(new Error('Unsupported language'));
  }
  
  console.log(`Executing command: ${command}`);

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stderr) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};
