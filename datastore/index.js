const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir + '/' + id + '.txt'), text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  var resultArray = [];
  fs.readdir(exports.dataDir, (err, files) => {
    _.map(files, (file) => {
      var id = file.slice(0, 5);
      var text = file.slice(0, 5);
      resultArray.push({id, text});
    });
    callback(null, resultArray);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir + '/' + id + '.txt'), 'utf8', (err, text) => {
    if (err) {
      callback(new Error (`No item with id: ${id}`));
    } else {
      callback (null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir + '/' + id + '.txt'), 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir + '/' + id + '.txt'), text, err => {
        if (err) {
          callback(new Error('unable to update file'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir + '/' + id + '.txt'), err => {
    if (err) {
      callback(new Error('unable to delete file'));
    } else {
      callback(console.log('success'));
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
