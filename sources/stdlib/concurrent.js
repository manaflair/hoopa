import { iterateWithContext } from '../lib/fn/iterateWithContext';
import { runHoopaContext }    from '../lib/fn/runHoopaContext';

export default function concurrent(next, context, { instructionSets }) {

    if (instructionSets.length === 0)
        throw new Error(`Expected at least one instruction set (got ${instructionSets.length})`);

    return iterateWithContext(context, instructionSets.length, (subContext, index) => {

        return runHoopaContext(subContext, instructionSets[index]);

    }, subContexts => {

        return context.push(subContexts.map(subContext => {
            return subContext.top();
        }));

    }).then(context => {

        return next(context);

    });

}
