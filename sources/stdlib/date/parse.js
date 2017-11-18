import moment from 'moment';

export default function parse(next, context, { arg, options: { locale = `en-US` } }) {

    let stdin = context.top();
    context = context.pop();

    return next(context.push(moment(stdin, arg, locale, true).unix()));

}
