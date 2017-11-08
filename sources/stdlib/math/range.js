export default function range(next, context, { options: { from = null, to = null, step = 1 } }) {

    let numbers = [];

    for (let t = Number(from), T = Number(to), s = Number(step); t < T; t += s)
        numbers.push(t);

    return next(context.push(numbers));

}
