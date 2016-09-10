const _ = require('lodash');

const configurations = [
    {
        alias: ['d', 'dev', 'development'],
        environment: 'development',
        debug: true,
        sourceMap: true,
        minimize: false,
        checkSyntax: true,
    },
    {
        alias: ['p', 'prod', 'production'],
        environment: 'production',
        debug: false,
        sourceMap: false,
        minimize: true,
        checkSyntax: false,
    },
];

const paramAliases = [ 'conf', 'config', 'configuration', 'env', 'environment', 'build' ];

let configuration;

process.argv.forEach(parameter => {
    if (!_.some(
        paramAliases,
        alias => _.startsWith(parameter, `--${alias}:`) || _.startsWith(parameter, `--${alias}=`))
    ) {
        return;
    }

    const colonsIndex = parameter.indexOf(':');
    const equalIndex = parameter.indexOf('=');

    const environment = parameter.substring((colonsIndex >=0 ? colonsIndex : equalIndex) + 1);

    const search = _.find(
        configurations,
        config => config.environment === environment ||  _.includes(config.alias, environment));

    if (search) {
        configuration = search;
    }
});

configuration = _.omit(configuration || configurations[0], 'alias');

process.stdout.write(`
Using configuration:
${JSON.stringify(configuration, null, '    ')}

`);

module.exports = configuration;