import { first, isEmpty }  from 'lodash';

import { runHoopaContext } from '../lib/fn/runHoopaContext';

export default function local(next, context, { arg: name, instructionSets }) {

    if (instructionSets.length >= 2)
        throw new Error(`Too many instruction sets`);

    context = context.declareRegisters({ [name]: undefined });

    if (isEmpty(instructionSets))
        return next(context);

    return runHoopaContext(context, first(instructionSets)).then(subContext => {
        return next(context.setRegisters({ [name]: subContext.top() }));
    });

}
