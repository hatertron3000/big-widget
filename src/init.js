const fs = require('fs')
const inquirer = require('inquirer')
const ncp = require('ncp')
const { promisify } = require('util')
const path = require('path')
const execa = require('execa')
const copy = promisify(ncp)
const chalk = require('chalk')

const templatesDirectory = path.resolve(__dirname, '../templates/'),
    initGit = async () => {
        const result = await execa('git', ['init']);
        if (result.failed) {
            return Promise.reject(new Error('Failed to initialize git'));
        }
        return;
    }


module.exports = argv => {
    const configFilename = `config.${argv.$0}.json`
    const secretsFilename = `secrets.${argv.$0}.json`

    fs.access(configFilename, fs.constants.F_OK, err => {
        if (!err) {
            console.log('A big-widget project already exists in this directory.')
            return
        }

        const templates = fs.readdirSync(templatesDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name),
            questions = [
                {
                    name: "name",
                    type: "input",
                    message: "Enter a widget template name (alphanumeric, space, or - characters only)",
                    default: "My Template",
                    validate: input => input.match(/[\w- ]{1,100}/)
                        ? true
                        : "Invalid name.",
                    filter: input => input.trim()
                },
                {
                    name: "template",
                    type: "list",
                    message: "Choose a template",
                    choices: templates
                },
                {
                    name: "token",
                    type: "input",
                    message: "Enter your an API access token",
                    validate: input => input.match(/[\w]{1,100}/)
                        ? true
                        : "Invalid access token",
                    filter: input => input.trim()
                },
                {
                    name: "apiPath",
                    type: "input",
                    message: "Enter your store's API path",
                    validate: input => input.match(/https:\/\/api.bigcommerce\.com\/stores\/[\w]{1,100}\/v3\//)
                        ? true
                        : "Invalid API path. Example: https://api.bigcommerce.com/stores/abcd1234/v3/",
                    filter: input => input.trim()
                }
            ]

        inquirer
            .prompt(questions)
            .then(answers => {
                console.log("Initializing the project...")

                const secrets = {
                    accessToken: answers.token
                },
                    config = {
                        name: answers.name,
                        apiPath: answers.apiPath
                    },

                    templateDirectory = `${templatesDirectory}/${answers.template}/`


                const promises = Promise.all([
                    fs.promises.writeFile(configFilename, JSON.stringify(config, null, 2)),
                    fs.promises.writeFile(secretsFilename, JSON.stringify(secrets, null, 2)),
                    copy(templateDirectory, process.cwd(), { clobber: false }),
                    initGit()
                ])

                promises
                    .then(() => {
                        console.log(chalk.cyan('Finished'))
                        console.log(`========`)
                        console.log(JSON.stringify(config, null, 2))
                    })
                    .catch(err => console.error(`${chalk.red('Error')} during initializationn\n`, err))
            })
    })
}

