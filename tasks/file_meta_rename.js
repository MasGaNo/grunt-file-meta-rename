"use strict";
var crc = require("crc");
var fs = require("fs");
function tokenize(fileMeta, options) {
    var match = options.filename.match(/\{(.*?)\}/g) || [];
    return match.reduce(function (targetPath, currentToken) {
        var token = currentToken.substr(1, currentToken.length - 2);
        return targetPath.replace(currentToken, fileMeta[token]);
    }, options.filename);
}
module.exports = function (grunt) {
    grunt.registerMultiTask('file_meta_rename', 'Rename files using their metadata', function () {
        var options = this.options({
            filename: '{name}.{ext}'
        });
        this.files.forEach(function (file) {
            file.src.forEach(function (filepath) {
                var cwd = file.cwd;
                var target = cwd + (cwd[cwd.length - 1] === '/' ? '' : '/') + filepath;
                if (!grunt.file.exists(target)) {
                    grunt.log.warn("Source file " + target + " not found.");
                    return false;
                }
                if (!grunt.file.isFile(target)) {
                    grunt.log.verbose.warn("Source " + target + " is not a valid file.");
                    return false;
                }
                var offsetFolder = target.lastIndexOf('/');
                var offsetExt = target.lastIndexOf('.');
                if (offsetExt < offsetFolder) {
                    offsetExt = target.length;
                }
                var fileMeta = {
                    name: target.substring(offsetFolder + 1, offsetExt),
                    ext: target.substr(offsetExt + 1)
                };
                fileMeta.crc32 = crc.crc32(fs.readFileSync(target)).toString(16);
                var fileStats = fs.statSync(target);
                fileMeta.dateCreated = Math.round(fileStats.birthtimeMs).toString();
                fileMeta.lastModified = Math.round(fileStats.mtimeMs).toString();
                fileMeta.size = fileStats.size.toString();
                var targetName = tokenize(Object.assign(fileMeta, options.tokens), options);
                var rootFolder = target.substr(0, offsetFolder);
                var targetPath = rootFolder + "/" + targetName;
                fs.renameSync(target, targetPath);
                grunt.log.verbose.writeln("Move " + target + " to " + targetPath);
            });
        });
    });
};
