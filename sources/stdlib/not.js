export default function not(next, context) {

    let stdin = context.top();
    context = context.pop();

    return next(context.push(!stdin));

}
