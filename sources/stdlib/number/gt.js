import { isNull } from 'lodash';

export default function gt(next, context, { arg: b, options: { orEq } }) {

    let a = Number(context.top());
    context = context.pop();

    if (!isNull(b)) {
        b = Number(b);
    } else {
        b = Number(context.top());
        context = context.pop();
    }

    if (orEq && a === b)
        return next(context.push(true));

    return next(context.push(a > b));

}
