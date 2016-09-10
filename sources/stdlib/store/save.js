import { ContextSymbols } from '../../lib/Context';

export default function save(next, context) {

    let document = context.top();
    context.pop();

    return context.registers[ContextSymbols.storageManager].save(document).then(() => {
        return next(context);
    });

}
