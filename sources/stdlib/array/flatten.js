import { flatten, isArray } from 'lodash';

export default function flatten_(next, context) {

    let stdin = context.top();
    context = context.pop();

    if (!isArray(stdin))
        throw new Error(`Invalid input, expected an array`);

    return next(context.push(flatten(stdin)));

}

Object.defineProperty(flatten_, `name`, {

    writable: false,
    enumerable: false,
    configurable: true,

    value: `flatten`

});
