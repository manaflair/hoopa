import numbro from 'numbro';

numbro.loadCulturesInNode('numbro');

export default function parse(next, context, { options: { locale = `en-US` } }) {

    let stdin = context.top();
    context = context.pop();

    return next(context.push(numbro.culture(locale)().unformat(stdin)));

}
