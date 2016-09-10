import { isNil } from 'lodash';

export function interpolateString(str, registers) {

    if (isNil(registers))
        throw new Error(`Invalid registers`);

    let fullMatch = str.match(/^\$\{(\w+)\}$/);

    if (fullMatch) {

        let [ , name ] = fullMatch;

        if (!Reflect.has(registers, name))
            throw new Error(`Undeclared variable "${name}"`);

        return registers[name];

    } else {

        return str.replace(/(^|[^\\])((?:\\\\)*\$\{\w+\})+/g, (all, prefix, variables) => {
            return prefix + variables.replace(/\$\{(\w+)\}/g, (all, name) => {

                if (!Reflect.has(registers, name))
                    throw new Error(`Undeclared variable "${name}"`);

                return registers[name];

            });
        });

    }

}
