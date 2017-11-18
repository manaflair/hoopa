import rc                          from 'rc';

import { Context, ContextSymbols } from './lib/Context';
import { ProgressManager }         from './lib/ProgressManager';

import { parseHoopaInstructions }  from './lib/fn/parseHoopaInstructions';
import { runHoopaContext }         from './lib/fn/runHoopaContext';

export { NetworkManager }          from './lib/NetworkManager';
export { StorageManager }          from './lib/StorageManager';

export function getRcConfiguration() {

    return rc(`hoopa`);

}

export default (code, {network, storage, parallel, progress} = {}) => {

    let definition = code.toString();
    let instructions = parseHoopaInstructions(definition);

    return runHoopaContext(new Context().declareRegisters({

        [ContextSymbols.networkManager]: network,
        [ContextSymbols.progressManager]: new ProgressManager({ onNotify: progress }).start(),
        [ContextSymbols.storageManager]: storage,

        [ContextSymbols.enableParallelProcessing]: parallel

    }), instructions).then(endContext => {

        return !endContext.isEmpty() ? endContext.top() : undefined;

    });

};
