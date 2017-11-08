import { isNull }         from 'lodash';

import { ContextSymbols } from '../Context';

export function iterateWithContext(context, cycleCount, runCycle, getFinalContext, { continueOnErrors = false, silentErrors = false } = {}) {

    let progressManager = context.registers[ContextSymbols.progressManager];
    let childProgressManagerInstances = progressManager.makeChildBucket(cycleCount);

    let runCycleWrapper = (context, index) => {

        let childProgressManager = childProgressManagerInstances[index];

        context = context.declareRegisters({ [ContextSymbols.progressManager]: childProgressManager });
        childProgressManager.start();

        return runCycle(context, index).then(subContext => {

            childProgressManager.end();

            return subContext;

        }, error => {

            childProgressManager.end();

            if (continueOnErrors && !silentErrors)
                console.error(error.stack);

            if (continueOnErrors || silentErrors) {
                return null;
            } else {
                throw error;
            }

        });

    };

    let promise = null;

    if (context.registers[ContextSymbols.enableParallelProcessing]) {

        let subPromises = [];

        for (let t = 0; t < cycleCount; ++t)
            subPromises.push(runCycleWrapper(context, t));

        return Promise.all(subPromises).then(subContexts => {
            return getFinalContext(subContexts.filter(context => {
                return !isNull(context);
            }));
        });

    } else {

        let promise = Promise.resolve([]);

        for (let t = 0; t < cycleCount; ++t) {
            promise = promise.then(subContexts => {
                return runCycleWrapper(context, t).then(subContext => {
                    return subContexts.concat([ subContext ]);
                });
            });
        }

        return promise.then(subContexts => {
            return getFinalContext(subContexts.filter(context => {
                return !isNull(context);
            }));
        });

    }

}
