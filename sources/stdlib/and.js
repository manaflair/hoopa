import { iterateWithContext } from '../lib/fn/iterateWithContext';
import { runHoopaContext }    from '../lib/fn/runHoopaContext';

export default function and(next, context, { instructionSets }) {

    if (instructionSets.length === 0)
        throw new Error(`Expected at least one instruction set (got ${instructionSets.length})`);

    return instructionSets.reduce((promise, instructionSet) => promise.then(result => {

        if (!result)
            return result;

        return runHoopaContext(context.clone(), instructionSet).then(context => {
            return context.top();
        });

    }), Promise.resolve(true)).then(result => {

        return next(context.push(result));

    });

}
