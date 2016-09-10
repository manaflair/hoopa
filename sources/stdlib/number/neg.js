export default function neg(next, context) {

    let stdin = Number(context.top());
    context = context.pop();

    return next(context.push(-stdin));

}
