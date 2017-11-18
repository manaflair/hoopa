import moment from 'moment';

export default function now(next, context, {}) {

    return next(context.push(moment().unix()));

}
