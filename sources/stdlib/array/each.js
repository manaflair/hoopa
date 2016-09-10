import { first, isArray }     from 'lodash';

import { iterateWithContext } from '../../lib/fn/iterateWithContext';
import { runHoopaContext }    from '../../lib/fn/runHoopaContext';

export default function each(next, context, { instructionSets, options: { continueOnErrors, silentErrors } }) {

    if (instructionSets.length !== 1)
        throw new Error(`Expected exactly one instruction set`);

    let stdin = context.top();
    context = context.pop();

    if (!isArray(stdin))
        throw new Error(`Invalid input, expected an array`);

    return iterateWithContext(context, stdin.length, (subContext, index) => {

        return runHoopaContext(subContext.push(stdin[index]), first(instructionSets));

    }, () => {

        return context;

    }, { continueOnErrors, silentErrors }).then(context => {

        return next(context);

    });

}
