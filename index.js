var styl = require('styl')
var fs = require('fs')
var crypto = require('crypto')
var path = require('path')

var filecache = {}

module.exports = function(readPath, writePath){
  var absReadPath = path.resolve(readPath)
  // console.log(absReadPath.split('.')[])
  fs.readFile(absReadPath, {encoding: 'utf8'}, function (err, data) {

    if (err) {
        throw err;
    }

    var hash = crypto.createHash('md5');
    hash.update(data);
    var hashVal = hash.digest('hex')

    if(typeof filecache[absReadPath] == undefined || filecache[absReadPath] != hashVal){

      var css = styl(data, { whitespace: true }).toString();
      if(typeof writePath == 'undefined') writePath = absReadPath.split('.')[0] + '.css'
      else writePath = path.resolve(writePath)

      fs.writeFile(writePath, css, function(err){
        if(err) throw err;
        filecache[absReadPath] = hashVal
      })
    }
    else{
      console.log('cached!!')
    }
  });
}