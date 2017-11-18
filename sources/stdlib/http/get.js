import { ContextSymbols }    from '../../lib/Context';
import { interpolateString } from '../../lib/fn/interpolateString';

export default function get(next, context, { arg: url, options: { type = `text`, full = false } }) {

    url = interpolateString(url, context);

    return context.registers[ContextSymbols.networkManager].get(url, { type, full }).then(content => {
        return next(context.push(content));
    });

}
