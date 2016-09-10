export default function range(next, context) {

    let numbers = [];

    let count = Math.floor(Number(context.top()));
    context = context.pop();

    let start = Math.floor(Number(context.top()));
    context = context.pop();

    for (let t = 0; t < count; ++ t)
        numbers.push(start + t);

    return next(context.push(numbers));

}
