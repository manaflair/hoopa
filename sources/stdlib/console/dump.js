export default function dump(next, context) {

    console.log(context.top());

    return next(context);

}
