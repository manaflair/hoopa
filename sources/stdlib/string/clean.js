import { decodeHTML } from 'entities';
import { isNil }      from 'lodash';

export default function clean(next, context, { options: { removeNewlines } }) {

    let value = context.top();
    context = context.pop();

    if (isNil(value))
        return next(context.push(value));

    value = String(value);
    value = decodeHTML(value);
    value = value.replace(/^\s+|\s+$/g, ``);
    value = value.replace(/\r\n?/g, `\n`);
    value = value.replace(/\n\n+/g, `\n`);
    value = value.replace(/’\s*/g, `'`);

    if (removeNewlines)
        value = value.replace(/\n/g, ``);

    return next(context.push(value));

}
