export default function null_(next, context) {

    return next(context.push(null));

}

Object.defineProperty(null_, `name`, {

    writable: false,
    enumerable: false,
    configurable: true,

    value: `null`

});
