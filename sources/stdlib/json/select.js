import { spawnExternalProcess } from '../../lib/fn/spawnExternalProcess';

export default function select(next, context, { arg: pattern }) {

    let stdin = context.top();
    context = context.pop();

    return spawnExternalProcess(`jq`, pattern, { stdin: JSON.stringify(stdin) }).then(result => {
        return next(context.push(JSON.parse(result)));
    });

}
