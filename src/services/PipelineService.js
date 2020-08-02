const ApiService = require('./ApiService.js')

const PipelineService = () => {
    const instance = {}

    return Object.freeze({
        ...instance,
        list: async (projectId, page = 1, perPage = 20) => {
            const urlParams = new URLSearchParams()
            urlParams.append('page', page)
            urlParams.append('per_page', perPage)

            return ApiService.fetch(`/projects/${projectId}/pipelines?${urlParams.toString()}`, { method: 'GET' })
        },
        get: async (projectId, id) => ApiService.fetch(`/projects/${projectId}/pipelines/${id}`, { method: 'GET' })
    })
}

module.exports = PipelineService()
