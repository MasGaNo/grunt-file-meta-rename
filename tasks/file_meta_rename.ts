import * as crc from 'crc';

import * as fs from 'fs';

type TOptions = {
    filename: string;
    tokens: {
        [token: string]: string;
    };
};

type TFileMetaKey = 'crc32'|'size'|'lastModified'|'dateCreated'|'name'|'ext';

type TFileMeta = {
    crc32: string;
    size: string;
    lastModified: string;
    dateCreated: string;
    name: string;
    ext: string;
};

type TCustomToken = TFileMeta & {[key: string]: string};

function tokenize(fileMeta: TCustomToken , options: TOptions) {
    const match: string[] = options.filename.match(/\{(.*?)\}/g) || [];

    return match.reduce((targetPath: string, currentToken: string) => {
        const token: TFileMetaKey = currentToken.substr(1, currentToken.length - 2) as TFileMetaKey;
        return targetPath.replace(currentToken, fileMeta[token]);
    }, options.filename);
}

export = function (grunt: IGrunt) {
    grunt.registerMultiTask('file_meta_rename', 'Rename files using their metadata', function () {

        const options: TOptions = this.options({
            filename: '{name}.{ext}',
            tokens: {}
        } as TOptions);

        let count = 0;

        this.files.forEach((file) => {

            file.src!.forEach((filepath) => {
                const cwd: string = (file as any).cwd;
                const target: string = cwd + (cwd[cwd.length - 1] === '/' ? '' : '/') + filepath;
                if (!grunt.file.exists(target)) {
                    grunt.log.warn(`Source file ${target} not found.`);
                    return false;
                }
                if (!grunt.file.isFile(target)) {
                    grunt.log.verbose.warn(`Source ${target} is not a valid file.`);
                    return false;
                }

                const offsetFolder = target.lastIndexOf('/');
                let offsetExt = target.lastIndexOf('.');
                if (offsetExt < offsetFolder) {
                    offsetExt = target.length;
                }
                const fileMeta: Partial<TFileMeta> = {
                    name: target.substring(offsetFolder + 1, offsetExt),
                    ext: target.substr(offsetExt + 1)
                };

                fileMeta.crc32 = crc.crc32(fs.readFileSync(target)).toString(16);
                const fileStats = fs.statSync(target);
                fileMeta.dateCreated = Math.round(fileStats.birthtimeMs).toString();
                fileMeta.lastModified = Math.round(fileStats.mtimeMs).toString();
                fileMeta.size = fileStats.size.toString();

                const targetName = tokenize(Object.assign(fileMeta, options.tokens) as TCustomToken, options);
                const rootFolder = target.substr(0, offsetFolder);
                const targetPath = `${rootFolder}/${targetName}`;

                fs.renameSync(target, targetPath);
                grunt.log.verbose.writeln(`Move ${target} to ${targetPath}`);
                ++count;
            });


        });

        grunt.log.writeln(`Move ${count} file(s).`);

    });
}
