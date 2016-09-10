import { isArray, sortBy }    from 'lodash';

import { iterateWithContext } from '../../lib/fn/iterateWithContext';
import { runHoopaContext }    from '../../lib/fn/runHoopaContext';

export default function sortBy_(next, context, { instructionSets }) {

    if (instructionSets.length < 1)
        throw new Error(`Expected at least one instruction set, got ${instructionSets.length}`);

    let stdin = context.top();
    context = context.pop();

    if (!isArray(stdin))
        throw new Error(`Invalid input, expected an array`);

    return iterateWithContext(context, instructionSets.length, (subContext, index) => {

        let predicateInstructionSet = instructionSets[index];

        return iterateWithContext(subContext, stdin.length, (subContext, index) => {

            return runHoopaContext(subContext.push(stdin[index]), predicateInstructionSet);

        }, subContexts => {

            return subContext.push(subContexts.map(subContext => {
                return subContext.top();
            }));

        });

    }, subContexts => {

        let lodashCollection = stdin.map((value, index) => {
            return index;
        });

        let lodashPredicates = subContexts.map(subContext => {
            let values = subContext.top();
            return index => values[index];
        });

        return context.push(sortBy(lodashCollection, lodashPredicates).map(index => {
            return stdin[index];
        }));

    }).then(context => {

        return next(context);

    });

}

Object.defineProperty(sortBy_, `name`, {

    writable: false,
    enumerable: false,
    configurable: true,

    value: `sortBy`

});
