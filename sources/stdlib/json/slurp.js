import { spawnExternalProcess } from '../../lib/fn/spawnExternalProcess';

export default function slurp(next, context, { arg: pattern }) {

    let stdin = context.top();
    context = context.pop();

    return spawnExternalProcess(`jq`, `-R`, `--slurp`, pattern, { stdin: String(stdin) }).then(result => {
        return next(context.push(JSON.parse(result)));
    });

}
