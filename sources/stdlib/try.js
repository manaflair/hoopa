import { runHoopaContext } from '../lib/fn/runHoopaContext';

export default function try_(next, context, { instructionSets }) {

    if (instructionSets.length < 1)
        throw new Error(`Expected at least one instruction set (try), got ${instructionSets.length}`);

    if (instructionSets.length > 2)
        throw new Error(`Expected at most two instruction sets (try-catch), got ${instructionSets.length}`);

    let [ tryBlock, catchBranch ] = instructionSets;

    return runHoopaContext(context.clone(), tryBlock).catch(error => {

        return runHoopaContext(context.push(error), catchBranch);

    }).then(context => {

        return next(context);

    });

}

Object.defineProperty(try_, `name`, {

    writable: false,
    enumerable: false,
    configurable: true,

    value: `try`

});
