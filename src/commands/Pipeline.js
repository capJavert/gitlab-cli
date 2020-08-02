const { PipelineService, Logger } = require('../services')
const {
    resolveResult, catchAll
} = require('../helpers')

const Pipeline = () => {
    const instance = {}

    return Object.freeze({
        ...instance,
        list: {
            command: 'pipeline-list <projectId> [page] [perPage]',
            describe: 'List pipelines for project',
            builder: (yargs) => {
                yargs
                    .positional('projectId', {
                        describe: 'projectId for which pipelines are fetched'
                    })
                    .positional('page', {
                        describe: 'page number to list',
                        default: 1
                    })
                    .positional('perPage', {
                        describe: 'results to show per page (max=100)',
                        default: 20
                    })
            },
            handler: catchAll(async (argv) => {
                const data = await PipelineService.list(argv.projectId, argv.page, argv.perPage)

                resolveResult(data, () => {
                    Logger.print()
                    Logger.print('Pipelines')
                    Logger.print('---------')
                    data.forEach(({
                        // eslint-disable-next-line camelcase
                        id, status, created_at, web_url
                    }) => Logger.print(id, status.toUpperCase(), created_at, web_url))
                })
            })
        }
    })
}

module.exports = Pipeline()
