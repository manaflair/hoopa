import { spawn } from 'child_process';

export function spawnExternalProcess(name, ... args) {

    let options = {};

    if (args.length > 0 && typeof args[args.length - 1] !== `string`)
        options = args.pop();

    return new Promise((resolve, reject) => {

        let stdout = ``;
        let stderr = ``;

        let process = spawn(name, args);

        process.stdout.setEncoding(`utf8`);

        process.stdout.on(`data`, data => {
            stdout += data.toString();
        });

        process.stderr.on(`data`, data => {
            stderr += data.toString();
        });

        process.on(`close`, code => {

            if (code === 0) {
                resolve(stdout);
            } else {
                reject(new Error(stderr));
            }

        });

        if (options.stdin) {
            process.stdin.write(options.stdin);
            process.stdin.end();
        }

    });

}
