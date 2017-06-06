'use strict';

const fs = require('fs');
const {
    execFile
} = require('child_process');

module.exports = (pluginContext) => {
    const app = pluginContext.app;
    const shell = pluginContext.shell;
    const logger = pluginContext.logger;
    const preferences = pluginContext.preferences;

    /* Members */
    var extIcons = {
        'rar': 'file-archive',
        'zip': 'file-archive',

        'doc': 'file-word',
        'xls': 'file-excel',
        'ppt': 'file-powerpoint',
        'pdf': 'file-pdf',
        
        'img': 'file-image',
        'png': 'file-image',
        'gif': 'file-image',
        'jpg': 'file-image',
        'jpeg': 'file-image',

        'aac': 'file-audio',
        'mp3': 'file-audio',
        'wav': 'file-sound',

        'mov': 'file-video',
        'flv': 'file-video',

        'txt': 'file-text',

        'java': 'file-code',
        'cs': 'file-code',
        'js': 'file-code',
        'jsp': 'file-code',
        'css': 'file-code',
        'sass': 'file-code',
        'scss': 'file-code',
        'ts': 'file-code',
        'coffee': 'file-code',
        'jsx': 'file-code'
    };

    /* Helpers */
    function resolveExtIcon(ext) {
        if (ext && extIcons[ext.toLowerCase()]) {
            return extIcons[ext.toLowerCase()];
        }
        return 'file';
    };

    /* Hooks */
    function startup() {
        initialize(preferences.get());
        preferences.on('update', initialize);
    }

    function search(q, res) {
        // Ger preferences
        var everythingExe = preferences.get().everythingInstallation;
        if (!everythingExe) {/e /
            everythingExe = "es";
        }

        // Pre-process `query`
        q = q.trim();

        //'-name', '-path-column', '-full-path-and-name', '-filename-column', '-extension', '-ext', '-size', '-date-created', '-date-modified', '-date-accessed', '-attributes'
        const child = execFile(everythingExe, ['-n', '10', '-s', q], function(error, stdout, stderr) {
            stdout.split('\n').forEach(function(filename) {
                filename = filename.trim();
                // Skip empty result
                if (!filename) {
                    return;
                }

                var fext = (filename.lastIndexOf(".") > 0 ? filename.substr(filename.lastIndexOf(".") + 1) : '');
                var fdesc = filename;
                var ficon = `#fa fa-${resolveExtIcon(fext)}-o`;
                var fname = filename.substr(filename.lastIndexOf("\\") + 1);
                fname = fname.substring(0, fname.length - fext.length - 1);

                res.add({
                    id: filename,
                    title: `${fname}${fext ? ' (' + fext + ')' : ''}`,
                    desc: fdesc,
                    payload: filename,
                    icon: ficon
                });
            });
        });
    }

    function execute(id, payload) {
        shell.openExternal(payload);
        app.close();
    }
    return { search, execute };
};
