import { interpolateString } from '../../lib/fn/interpolateString';

export default function log(next, context, { arg: string }) {

    console.log(interpolateString(string, context.registers));

    return next(context);

}
