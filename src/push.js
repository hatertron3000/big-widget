const axios = require('axios').default
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const getPaths = require('../util/get-paths')



const postTemplate = async ({
    config,
    secrets,
    schema,
    storefront_api_query,
    template,
    configFilePath,
    argv
}) => {

    const data = {
        name: config.name,
        schema,
        storefront_api_query,
        template,
        channel_id: config.channel_id,
    }
    axios.post(`${config.apiPath}content/widget-templates`, data, {
        headers: {
            'X-Auth-Token': secrets.accessToken,
        }
    }).then(res => {
        const { uuid, current_version_uuid } = res.data.data
        console.log(`${chalk.green('Success')}, updating config.`)
        config.uuid = uuid
        config.current_version_uuid = current_version_uuid
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
        console.log(chalk.cyan('Finished'))
        console.log(`========`)
        console.log(JSON.stringify(config, null, 2))
    }).catch(err => {
        console.log(`${chalk.red('Error')} creating widget template.`)
        console.error(err)
    })
}

const putTemplate = async ({
    config,
    secrets,
    schema,
    storefront_api_query,
    template,
    configFilePath,
    argv
}) => {

    const data = {
        name: config.name,
        schema,
        storefront_api_query,
        template,
        create_new_version: !argv.apply,
        channel_id: config.channel_id,
    }
    axios.put(`${config.apiPath}content/widget-templates/${config.uuid}`, data, {
        headers: {
            'X-Auth-Token': secrets.accessToken,
        }
    }).then(res => {
        const { uuid, current_version_uuid } = res.data.data
        console.log(`${chalk.green('Success')}, updating config.`)
        config.uuid = uuid
        config.current_version_uuid = current_version_uuid
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2))
        console.log(chalk.cyan('Finished'))
        console.log(`========`)
        console.log(JSON.stringify(config, null, 2))
    }).catch(err => {
        console.log(`${chalk.red('Error')} updating widget template.`)
        console.error(err)
    })
}


module.exports = argv => {
    const {
        cwd,
        configFilePath,
        secretsFilePath,
        schemaFilePath,
        storefrontApiQueryFilePath,
        templateFilePath,
    } = getPaths(argv)

    try {
        const config = require(configFilePath)
        const options = {
            config,
            secrets: require(secretsFilePath),
            schema: require(schemaFilePath),
            storefront_api_query: fs.readFileSync(storefrontApiQueryFilePath, 'utf8'),
            template: fs.readFileSync(templateFilePath, 'utf8'),
            configFilePath,
            argv
        }


        if (!config.uuid) {
            postTemplate(options)
        } else {
            putTemplate(options)
        }

    } catch (err) {
        console.log(`No ${argv.$0} project found. Run ${chalk.cyan('big-widget init')} to create a project`)
    }
}
