export default function match(next, context, { arg: pattern }) {

    let stdin = context.top();
    context = context.pop();

    let regexp = new RegExp(pattern);
    let match = stdin ? stdin.match(regexp) : null;

    if (match) {

        let groupCount = match.length - 1;

        for (let t = 0; t < groupCount; ++t) {
            context = context.push(match[t + 1]);
        }

    } else {

        let ccRegexp = new RegExp(`${pattern}|`);
        let groupCount = ccRegexp.exec(``).length - 1;

        for (let t = 0; t < groupCount; ++t) {
            context = context.push(null);
        }

    }

    return next(context);

}
