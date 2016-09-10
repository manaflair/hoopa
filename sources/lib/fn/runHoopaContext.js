import { getAction } from './getAction';

export function runHoopaContext(context, instructions = []) {

    if (instructions.length === 0)
        return Promise.resolve(context);

    let instruction = instructions[0];

    return Promise.resolve().then(() => {

        return getAction(instruction.name);

    }).then(action => {

        return action(nextContext => {
            return runHoopaContext(nextContext, instructions.slice(1));
        }, context, instruction);

    }).then(endContext => {

        return endContext;

    }).catch(error => {

        if (!error.instruction)
            error.instruction = instruction;

        throw error;

    });

}
