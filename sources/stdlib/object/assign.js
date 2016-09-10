import { isArray } from 'lodash';

export default function assign(next, context) {

    let stdin = context.top();
    context = context.pop();

    if (!isArray(stdin))
        throw new Error(`Invalid input, expected an array`);

    return next(context.push(Object.assign({}, ... stdin)));

}
