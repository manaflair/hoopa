import { ContextSymbols } from '../../lib/Context';

export default function has(next, context) {

    let document = context.top();
    context.pop();

    return context.registers[ContextSymbols.storageManager].find(document).then(document => {
        return next(context.push(Boolean(document)));
    });

}
