import { isNull } from 'lodash';

export default function neq(next, context, { arg: b }) {

    let a = Number(context.top());
    context = context.pop();

    if (!isNull(b)) {
        b = Number(b);
    } else {
        b = Number(context.top());
        context = context.pop();
    }

    return next(context.push(a !== b));

}
