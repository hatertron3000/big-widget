const inquirer = require('inquirer')
const axios = require('axios').default
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const getPaths = require('../util/get-paths')

const deleteFiles = ({
    configFilePath,
    secretsFilePath,
    schemaFilePath,
    storefrontApiQueryFilePath,
    templateFilePath,
}) => {
    return Promise.all([
        fs.promises.unlink(configFilePath),
        fs.promises.unlink(secretsFilePath),
        fs.promises.unlink(schemaFilePath),
        fs.promises.unlink(storefrontApiQueryFilePath),
        fs.promises.unlink(templateFilePath),
        fs.promises.rmdir('.git', { recursive: true }),
        fs.promises.unlink('.gitignore')
    ])
}

const deleteProject = async argv => {
    const paths = getPaths(argv)
    const {
        configFilePath,
        secretsFilePath,
    } = paths

    try {
        const config = require(configFilePath)
        const { apiPath, uuid } = config
        const secrets = require(secretsFilePath)
        const { accessToken } = secrets

        console.log(`${chalk.yellow('Deleting')} ${config.name}`)

        if (uuid) {
            axios.delete(`${apiPath}content/widget-templates/${uuid}`, {
                headers: {
                    'X-Auth-Token': accessToken
                }
            })
                .then(res => {
                    if (res.status !== 204)
                        throw new Error(`${chalk.red('Error')} deleting widget template. Received ${chalk.cyan(res.status)}:\n${res.data}`)
                    return deleteFiles(paths)
                })
                .then(() => {
                    console.log(`Deleted ${config.name} files locally and removed the widget template from the store`)
                    console.log(chalk.cyan('Finished'))
                })
                .catch(err => console.error(`${chalk.red('Error')} deleting project\n${err}`))
        } else {
            console.log('No remove project found, removing local files...')
            deleteFiles(paths)
                .then(() => {
                    console.log(`Deleted ${config.name}`)
                    console.log(chalk.cyan('Finished'))
                })
                .catch(err => console.error(`${chalk.red('Error')} deleting project\n${err}`))
        }
    } catch (err) {
        console.log(`No ${argv.$0} project found. Run ${chalk.cyan('big-widget init')} to create a project`)
    }
}

module.exports = argv => {
    const questions = [
        {
            type: 'input',
            name: 'confirm',
            message: `${chalk.yellowBright('Warning!')} This will ${chalk.red('remove')} your local project files and ${chalk.red('delete')} the widget template from your store. Any widgets using this template will be ${chalk.red('removed')} from the storefront
            Do you with to proceed? [Y/N]`,
            validate: answer => answer.length >= 1
        }
    ]

    inquirer.prompt(questions)
        .then(({ confirm }) => {
            if (confirm.toLowerCase() === 'yes'
                || confirm.toLowerCase() === 'y') deleteProject(argv)
            return
        })
}
