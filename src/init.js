const fs = require('fs')

module.exports = function init(argv) {
    console.log(argv)
    console.log('Initializing the project...')
    const promises = Promise.all([
        /* TODO: Copy templates */
        // fs.promises.writeFile('template.html'),
        // fs.promises.writeFile('storefront_api_query.graphql'),
        // fs.promises.writeFile('config.json'),
        // fs.promises.writeFile('secrets.json')
        fs.promises.writeFile(`./.${argv.$0}`)
    ])

    promises
        .then(console.log('Finished!'))
        .catch(err => console.error('Error during initialization', err))
}