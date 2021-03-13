const path = require('path')

module.exports = argv => {
    const cwd = process.cwd()
    const configFilePath = path.resolve(cwd, `config.${argv.$0}.json`)
    const secretsFilePath = path.resolve(cwd, `secrets.${argv.$0}.json`)
    const schemaFilePath = path.resolve(cwd, 'schema.json')
    const storefrontApiQueryFilePath = path.resolve(cwd, 'storefront-api-query.graphql')
    const templateFilePath = path.resolve(cwd, 'template.html')

    return {
        cwd,
        configFilePath,
        secretsFilePath,
        schemaFilePath,
        storefrontApiQueryFilePath,
        templateFilePath,
    }

}