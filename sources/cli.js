import { createReadStream }          from 'fs';
import { debounce }                  from 'lodash';
import minimist                      from 'minimist';
import moment                        from 'moment';
import ProgressBar                   from 'progress';

import { consumeStream }             from './lib/fn/consumeStream';
import { NetworkManager }            from './lib/NetworkManager';
import { StorageManager }            from './lib/StorageManager';
import hoopa, { getRcConfiguration } from './index';

let config = getRcConfiguration();

let options = minimist(process.argv.slice(2), {

    string: [

        `storage`

    ],

    boolean: [

        `parallel`,
        `progress`

    ],

    default: {

        [`storage`]: null,

        [`parallel`]: false,
        [`progress`]: false

    }

});

let progressBar = options.progress ? (() => {

    let progressBar = new ProgressBar(`Processing [:bar] :percent :customEta`, { total: 80 })
    progressBar.update(0, { customEta: `---` });

    return progressBar;

})() : null;

let printProgress = debounce(function printProgress(progressManager) {

    if (!progressBar)
       return ;

    let elapsed = progressManager.getElapsedTime();
    let duration = progressManager.guessDuration();
    let progress = elapsed / duration;

    progressBar.update(progress, {
        customEta: `${Math.ceil(moment.duration(duration - elapsed).asMinutes())}m`
    });

});

let networkManager = new NetworkManager(config.networkManager);
let storageManager = new StorageManager(options.storage);

function runStream(stream) {

    return consumeStream(stream).then(data => {
        return hoopa(data, { network: networkManager, storage: storageManager, progress: printProgress, parallel: options.parallel });
    });

}

let promise = options._.length === 0

    ? runStream(process.stdin)

    : options.parallel

        ? Promise.all(options._.map(path => {
            return runStream(createReadStream(path));
        }))

        : options._.reduce((promise, path) => {

            return promise.then(() => {
                return runStream(createReadStream(path));
            });

        }, Promise.resolve());

promise.catch(error => {

    if (error.instruction) {
        console.error(`When evaluating "${error.instruction.name}" at line ${error.instruction.source.location.start.line}`);
        console.error(error.stack);
    } else {
        console.error(error);
    }

});
