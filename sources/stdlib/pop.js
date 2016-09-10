export default function pop(next, context) {

    return next(context.pop());

}
