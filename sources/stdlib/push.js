import { interpolateString } from '../lib/fn/interpolateString';

export default function push(next, context, { arg: string }) {

    return next(context.push(interpolateString(string, context)));

}
