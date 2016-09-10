import { first, isEmpty }  from 'lodash';

import { runHoopaContext } from '../lib/fn/runHoopaContext';

export default function update(next, context, { arg: name, instructionSets }) {

    if (instructionSets.length >= 2)
        throw new Error(`Too many instruction sets`);

    if (isEmpty(instructionSets)) {

        let value = context.top();
        context = context.pop();

        return next(context.setRegisters({ [name]: value }));

    } else {

        return runHoopaContext(context.push(context.registers[name]), first(instructionSets)).then(subContext => {
            return next(context.setRegisters({ [name]: subContext.top() }));
        });

    }

};
