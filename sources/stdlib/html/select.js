import cheerio from 'cheerio';

let ALLOWED_TYPES = [

    `element`,
    `element[]`,
    `element+`,

    `json`,
    `json[]`,

    `text`,
    `text[]`,
    `text+`

];

function toHtml(element) {

    if (!element.length)
        return null;

    return cheerio.html(element);

}

function toJs(element) {

    if (!element.length)
        return null;

    return Object.assign({}, element.get(0).attribs);

}

function toText(element) {

    if (!element.length)
        return null;

    return element.find(`:empty`).replaceWith(` `).end().text();

}

function apply(elements, fn) {

    let results = [];

    for (let t = 0; t < elements.length; ++t)
        results.push(fn(elements.eq(t)));

    return results;

}

function castResult(elements, type) {

    switch (type) {

        case `element`:
            return toHtml(elements.first());

        case `element[]`:
            return apply(elements, toHtml);

        case `element+`:
            return apply(elements, toHtml).join(`\n`);

        case `json`:
            return toJs(elements.first());

        case `json[]`:
            return apply(elements, toJs);

        case `text`:
            return toText(elements.first());

        case `text[]`:
            return apply(elements, toText);

        case `text+`:
            return elements.text();

        default: {
            throw new Error(`Invalid response type`);
        }

    }

}

export default function select(next, context, { arg: selector, options: { type = `element[]`, tolerant = false } }) {

    if (!ALLOWED_TYPES.includes(type))
        throw new Error(`Invalid type "${type}", expected one of: ${ALLOWED_TYPES.map(type => `"${type}"`).join(`, `)}`);

    let stdin = context.top();
    context = context.pop();

    let elements = cheerio(selector, stdin);

    if (!tolerant && elements.length === 0)
        throw new Error(`Selector failed, no matching element found`);

    let result = castResult(elements, type);

    return next(context.push(result));

}
