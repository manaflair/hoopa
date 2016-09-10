import { ContextSymbols }    from '../../lib/Context';
import { interpolateString } from '../../lib/fn/interpolateString';

export default function get(next, context, { arg: url, options: { type = `text` } }) {

    url = interpolateString(url, context.registers);

    return context.registers[ContextSymbols.networkManager].get(url, { type }).then(content => {
        return next(context.push(content));
    });

}
