# grunt-file-meta-rename - v0.1.0
Rename files based on their metadata.

## Important: Node >= 6.3.0 < 6.9.2
As this plugin is dependant of [node-crc](https://github.com/alexgorbatchev/node-crc) package, please check this [issue](https://github.com/alexgorbatchev/node-crc#important-node--630--692).

## Why I wrote this plugin?
I need to rename all my files based on their metadata.
So I made this plugin to analyze all kind of information from file, before to be rename correctly.

Today, this plugin doesn't make any modification from the current name of the file as I use this plugin for files generated during the build. 
But for some needs, if we want to use this plugin in the sames set of files, maybe we can add a way to revert the previous modification before to process again the rename.

Example:
```
> ls
content.txt
video.mp4
> grunt
>> Filename: {name}_[{crc32}].{ext}
Move 2 file(s).
> ls
content_[f87e6c9].txt
video_[6b79d0ae].mp4
> grunt
>> Filename: {name}_[{crc32}].{ext}
Move 2 file(s).
> ls
content_[f87e6c9]_[f87e6c9].txt
video_[6b79d0ae]_[6b79d0ae].mp4
```

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out this [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install github:MasGaNo/grunt-file-meta-rename --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-file-meta-rename');
```

## The task

### Overview
In your project's Gruntfile, add a section named `file_meta_rename` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  file_meta_rename: {
    your_target: {
      options: {
        // filename: string | default: "{name}.{ext}"
        // tokens: object | default: null
      },
      // contents like this:
      files: [
          {
              cwd: '',
              src: ['**/*', '*']
          }
      ]
    },
  },
})
```

### Options

#### options.filename
Type: `String`
Default value: `{name}.{ext}`

Filename pattern. You can use all the [tokens](#built-in-tokens), in the order you want. 

*Note:*

*Don't forget the extension, it will not be automatically added.*

#### options.tokens
Type: `Object`
Default value: `null`

Provide a list of custom tokens to be used by filename pattern.

The key will be used as token name.

*Note:*

*Today, this plugin supports only plain object.*

### Built-in Tokens

This plugin provide a list of built-in tokens that can be used in the Gruntfile:
- `crc32`: The crc32 (checksum) of the file.
- `size`: The size of the file
- `lastModified`: Timestamp of the last modification date.
- `dateCreated`: Timestamp of the creation date.
- `name`: Base name of the file.
- `ext`: Extension of the file.

### Example
```
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
```

### TODOS
- Add custom token function: provide a function instead of a static string value in custom tokens option.
- Add token `indexGlobal`: position in all process
- Add token `indexFolder`: position in the current folder
- Add token `indexGlobalPad` and `indexFolderPad`: based on `indexGlobal` and `indexFolder` extended by left-pad 0 to keep the same length in the position token.
- Subobject token?: Provide a key as:
```
{
    filename: "{token.sub.object}.{ext}"
    tokens: {
        token: {
            sub: {
                object: 42
            }
        }
    }
}
```
