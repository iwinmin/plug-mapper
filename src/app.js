'use strict';
const fs = require('fs');
const task = require('plug-task');

exports.new = function(opts) {
    return new App(opts);
}

class App {
    constructor(options) {
        this.conf_file = (options.conf_file || null);
    }

    run() {
        var self = this;
        if (!self.init_task) {
            self.init_task = task.start(initApp(self), 'plug-mapper-app');
            self.init_task.then(initSuccess.bind(self), initFail.bind(self));
        }
        return self;
    }

    getConfig(name, default_value) {
    }

    // flush app config, and load from config file
    *reloadConfig() {
        if (!this.conf_file) {
            return false;
        }
        try {
            const GeneratorFunction = initApp.constructor;
            var config = {};
            var code = yield* this.readFile(this.conf_file);
            var fn = new GeneratorFunction('config', code);
            var ret = yield* fn(config);
            this.config = (ret === undefined) ? config : ret;
            return true;
        }
        catch (err) {
            console.error('Load Config Error: ', err);
            return false;
        }
    }

    // stop the app and start the service again
    *restart() {

    }
}

App.prototype.readFile = task.thunk(fs.readFile);
App.prototype.writeFile = task.thunk(fs.writeFile);

function* initApp(app) {
    // load config
    var succ = yield* app.reloadConfig();

    console.log('app config', app.config);

    // start the service first time
    if (succ) {
        yield* app.restart();
    }
}

function initSuccess() {

}

function initFail(err) {

}