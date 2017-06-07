'use strict';

const fs = require('fs');
const {
    execFile
} = require('child_process');
const packageName = require('./package.json').name;
const icons = require('./icons.js');


const resolveIcon = (filename) => {
    const ext = (filename.lastIndexOf(".") > 0 ? filename.substr(filename.lastIndexOf(".") + 1).trim().toLowerCase() : '');
    if (icons[ext]) {
        return `#fa fa-${icons[ext]}-o`;
    }
    return `#fa fa-file-o`;;
};

module.exports = ({ app, clipboard, logger, preferences, shell, toast }) => {
    var everythingCli;

    const initialize = (p) => {
        everythingCli = (p.everythingCli ? p.everythingCli : 'es');
    };

    /* Extensions */
    const startup = () => {
        initialize(preferences.get());
        preferences.on('update', initialize);
    };

    const search = (query, res) => {
        //'-name', '-path-column', '-full-path-and-name', '-filename-column', '-extension', '-ext', '-size', '-date-created', '-date-modified', '-date-accessed', '-attributes'
        const child = execFile(everythingCli, ['-n', '10', '-s', query.trim()], (error, stdout, stderr) => {
            stdout.split('\n').forEach((filename) => {
                filename = filename.trim();
                // Skip empty result
                if (!filename) {
                    return;
                }

                res.add({
                    id: filename,
                    title: filename.substr(filename.lastIndexOf("\\") + 1),
                    desc: filename,
                    payload: filename,
                    icon: resolveIcon(filename)
                });
            });
        });
    };

    const execute = (id, payload) => {
        shell.openExternal(payload);
        app.close();
    };

    return {
        startup,
        search,
        execute
    };
};
