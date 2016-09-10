export default function dup(next, context) {

    return next(context.push(context.top()));

}
