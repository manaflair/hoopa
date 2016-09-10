import { isString, isUndefined } from 'lodash';

export default function wrap(next, context, { options: { key } }) {

    if (isUndefined(key))
        throw new Error(`Missing required option "key"`);

    if (!isString(key))
        throw new Error(`Invalid key`);

    let stdin = context.top();
    context = context.pop();

    return next(context.push({ [key]: stdin }));

}
