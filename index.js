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
    const extIcons = {
        'rar': 'file-archive',
        'zip': 'file-archive',
        '7z': 'file-archive',
        'tar': 'file-archive',

        'doc': 'file-word',
        'docx': 'file-word',
        'xls': 'file-excel',
        'xlsx': 'file-excel',
        'ppt': 'file-powerpoint',
        'pptx': 'file-powerpoint',
        'pdf': 'file-pdf',
        
        'img': 'file-image',
        'png': 'file-image',
        'gif': 'file-image',
        'jpg': 'file-image',
        'jpeg': 'file-image',

        'aac': 'file-audio',
        'mp3': 'file-audio',
        'wav': 'file-sound',

        'mp4': 'file-video',
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

    const resolveExtIcon = (ext) => {
        if (ext && extIcons[ext.toLowerCase()]) {
            return extIcons[ext.toLowerCase()];
        }
        return 'file';
    };

    /* Prefereneces */
    var everythingCli;
    const initialize = (p) => {
        everythingCli = (p.everythingCli ? p.everythingCli : 'es');
    };

    /* Extensions */
    function startup() {
        initialize(preferences.get());
        preferences.on('update', initialize);
    }

    function search(q, res) {
        // Pre-process `query`
        q = q.trim();

        //'-name', '-path-column', '-full-path-and-name', '-filename-column', '-extension', '-ext', '-size', '-date-created', '-date-modified', '-date-accessed', '-attributes'
        const child = execFile(everythingCli, ['-n', '10', '-s', q], function(error, stdout, stderr) {
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

                res.add({
                    id: filename,
                    title: fname,
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

    return { startup, search, execute };
};
