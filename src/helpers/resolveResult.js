const Logger = require('../services/Logger')

const resolveResult = (data, onSuccess, argv) => {
    if (argv.raw) {
        Logger.print(data)
        return
    }

    if (data instanceof Error) {
        Logger.print(data.message)
        return
    }

    onSuccess()
}

module.exports = resolveResult
