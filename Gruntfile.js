'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        file_meta_rename: {
            default: {
                options: {
                    filename: "{name}[{crc32}]-{version}.{ext}",
                    tokens: {
                         version: 'v5'
                    }
                },
                files: [
                    {
                        cwd: 'test/fixtures/',
                        src: ['**/*', '*']
                    }
                ]
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['file_meta_rename']);

}
