module.exports = function push(argv) {
    console.log('push logic goes here')
    if (argv.overwrite) {
        console.log('overwrite option enabled')
    }
}