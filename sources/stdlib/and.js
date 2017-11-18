import { last }               from 'lodash';

import { iterateWithContext } from '../lib/fn/iterateWithContext';

export default function and(next, context, { instructionSets }) {

    if (instructionSets.length === 0)
        throw new Error(`Expected at least one instruction set (got ${instructionSets.length})`);

    return iterateWithContext(context, instructionSets.length, (subContext, index) => {

        return run(subContext, instructionSets[index]);

    }, subContexts => {

        let doesSucceed = subContexts.every(context => context.top());

        return context.push(doesSucceed ? last(subContexts) : null);

    }).then(context => {

        return next(context);

    });

};
