import { Context, ContextSymbols } from './lib/Context';
import { NetworkManager }          from './lib/NetworkManager';
import { ProgressManager }         from './lib/ProgressManager';
import { StorageManager }          from './lib/StorageManager';

import { parseHoopaInstructions }  from './lib/fn/parseHoopaInstructions';
import { runHoopaContext }         from './lib/fn/runHoopaContext';

export default (code, {networkManager, storage, parallel, progress} = {}) => {

    let definition = code.toString();
    let instructions = parseHoopaInstructions(definition);

    return runHoopaContext(new Context().declareRegisters({

        [ContextSymbols.networkManager]: new NetworkManager(networkManager),
        [ContextSymbols.progressManager]: new ProgressManager({ onNotify: progress }).start(),
        [ContextSymbols.storageManager]: new StorageManager(storage),

        [ContextSymbols.enableParallelProcessing]: parallel

    }), instructions).then(endContext => {

        return !endContext.isEmpty() ? endContext.top() : undefined;

    });

};
