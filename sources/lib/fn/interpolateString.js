import { isNil } from 'lodash';

function getStringVariable(context, name) {

    if (name[0] === `^`) {

        return context.at(name.slice(1));

    } else {

        if (!Reflect.has(context.registers, name))
            throw new Error(`Undeclared variable "${name}"`);

        return Reflect.get(context.registers, name);

    }

}

export function interpolateString(str, context) {

    let fullMatch = str.match(/^\$\{(\w+|\^[0-9]+)\}$/);

    if (fullMatch) {

        let [ , name ] = fullMatch;

        return getStringVariable(context, name);

    } else {

        return str.replace(/(^|[^\\])(?:\\\\)*\$\{(\w+|\^[0-9]+)\}/g, (all, prefix, name) => {
            return prefix + getStringVariable(context, name);
        });

    }

}
