export default function slice(next, context, { options: { begin = 0, end = Infinity } }) {

    let stdin = context.top();
    context = context.pop();

    return next(context.push(stdin.slice(begin, end)));

}
