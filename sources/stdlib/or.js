import { iterateWithContext } from '../lib/fn/iterateWithContext';

export default function or(next, context, { instructionSets }) {

    if (instructionSets.length === 0)
        throw new Error(`Expected at least one instruction set (got ${instructionSets.length})`);

    return iterateWithContext(context, instructionSets.length, (subContext, index) => {

        return run(subContext, instructionSets[index]);

    }, subContexts => {

        let firstSuccessfulBranch = subContexts.find(context => context.top());

        return context.push(firstSuccessfulBranch ? firstSuccessfulBranch.top() : null);

    }).then(context => {

        return next(context);

    });

};
