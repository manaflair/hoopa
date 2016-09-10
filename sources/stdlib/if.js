import { runHoopaContext } from '../lib/fn/runHoopaContext';

export default function if_(next, context, { instructionSets, options: { not = false } }) {

    if (instructionSets.length < 2)
        throw new Error(`Expected at least two instruction sets (if-then), got ${instructionSets.length}`);

    if (instructionSets.length > 3)
        throw new Error(`Expected at most three instruction sets (if-then-else), got ${instructionSets.length}`);

    let [ conditionBlock, ifBranch, elseBranch ] = instructionSets;

    return runHoopaContext(context.clone(), conditionBlock).then(resultContext => {

        let result = not ? !resultContext.top() : resultContext.top();

        return runHoopaContext(context.clone(), result ? ifBranch : elseBranch);

    }).then(() => {

        return next(context);

    });

}

Object.defineProperty(if_, `name`, {

    writable: false,
    enumerable: false,
    configurable: true,

    value: `if`

});
