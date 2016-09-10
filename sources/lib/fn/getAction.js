import { isFunction, memoize } from 'lodash';
import { join as joinPath }    from 'path';

export let getAction = memoize(instructionName => {

    let parts = instructionName.split(/\./);
    let path = joinPath(... parts);

    let action = require(`../../stdlib/${path}`).default;

    if (!isFunction(action))
        throw new Error(`Invalid action in stdlib file "${path}"`);

    return action;

});
