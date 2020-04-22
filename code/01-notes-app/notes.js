const fs = require('fs');

const getNotes = function () {
  const fileDir = './notes.txt';
  const notes = fs.readFileSync(fileDir);
  return `Your notes...\n${notes}`;
};

module.exports = {
  getNotes
};
