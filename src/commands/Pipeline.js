const prompt = require('inquirer').createPromptModule()
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
        },
        get: {
            command: 'pipeline-get <projectId> <id>',
            describe: 'Get pipeline status',
            builder: (yargs) => {
                yargs
                    .positional('projectId', {
                        describe: 'projectId for which pipelines are fetched'
                    })
                    .positional('id', {
                        describe: 'pipeline id'
                    })
                    .option('entity', {
                        describe: 'get other entities for pipeline',
                        choices: ['variables', 'test_report']
                    })
            },
            handler: catchAll(async (argv) => {
                const data = await PipelineService.get(argv.projectId, argv.id, argv.entity)

                resolveResult(data, () => {
                    if (argv.entity && data.length === 0) {
                        Logger.print(`No ${argv.entity}`)
                        return
                    }

                    Object.keys(data).forEach((key) => {
                        switch (key) {
                        case 'user':
                            Logger.print(`${key}:`, data[key].name)
                            break
                        case 'detailed_status':
                            break
                        default:
                            Logger.print(`${key}:`, data[key])
                        }
                    })
                })
            })
        },
        create: {
            command: 'pipeline-create <projectId> <ref>',
            describe: 'Start new pipeline',
            builder: (yargs) => {
                yargs
                    .positional('projectId', {
                        describe: 'projectId for which pipelines are fetched'
                    })
                    .positional('ref', {
                        describe: 'reference to commit'
                    })
            },
            handler: catchAll(async (argv) => {
                const data = await PipelineService.create(
                    argv.projectId,
                    argv.ref
                )

                resolveResult(data, () => {
                    Logger.print(`Pipeline #${data.id} created and ${data.status}...`)
                })
            })
        },
        delete: {
            command: 'pipeline-delete <projectId> <id>',
            describe: 'Delete pipeline',
            builder: (yargs) => {
                yargs
                    .positional('projectId', {
                        describe: 'projectId for which pipelines are fetched'
                    })
                    .positional('id', {
                        describe: 'pipeline id'
                    })
            },
            handler: catchAll(async (argv) => {
                const { deleteConfirmed } = await prompt([{
                    name: 'deleteConfirmed', type: 'confirm', message: `Are you sure you wish to delete pipeline #${argv.id}?`, default: false
                }])

                if (!deleteConfirmed) {
                    return
                }

                const data = await PipelineService.delete(argv.projectId, argv.id)

                resolveResult(data, () => {
                    Logger.print(`Pipeline #${argv.id} removed!`)
                })
            })
        }
    })
}

module.exports = Pipeline()
