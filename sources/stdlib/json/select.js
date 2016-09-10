import { spawnExternalProcess } from '../../lib/fn/spawnExternalProcess';

export default function select(next, context, { arg: pattern }) {

    let stdin = JSON.stringify(context.top());
    context = context.pop();

    return spawnExternalProcess(`jq`, ... pattern.split(/\s+/g), { stdin }).then(result => {
        return next(context.push(JSON.parse(result)));
    });

}
