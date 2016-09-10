import { readFileSync }               from 'fs';
import { memoize }                    from 'lodash';
import { generate as generateParser } from 'pegjs';

let getParser = memoize(() => {

    let grammar = readFileSync(`${__dirname}/parseHoopaInstructions.peg`).toString();

    return generateParser(grammar);

});

export function parseHoopaInstructions(data) {

    return getParser().parse(String(data));

}
