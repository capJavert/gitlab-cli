const ApiService = require('./ApiService.js')

const IssueService = () => {
    const instance = {}

    return Object.freeze({
        ...instance,
        list: async (
            projectId,
            page = 1,
            perPage = 20,
            search,
            state,
            assignee,
            orderBy,
            sort,
            scope
        ) => {
            const urlParams = new URLSearchParams()
            urlParams.append('page', page)
            urlParams.append('per_page', perPage)
            urlParams.append('search', search)
            urlParams.append('state', state)
            urlParams.append('assignee_username', assignee)
            urlParams.append('order_by', orderBy)
            urlParams.append('sort', sort)
            urlParams.append('scope', scope)

            return ApiService.fetch(`/projects/${projectId}/issues?${urlParams.toString()}`, { method: 'GET' })
        },
        get: async (projectId, id) => ApiService.fetch(`/projects/${projectId}/issues/${id}`, { method: 'GET' }),
        create: async (projectId, payload) => ApiService.fetch(`/projects/${projectId}/issues`, {
            method: 'POST',
            body: JSON.stringify(payload)
        }),
        update: async (projectId, id, payload) => ApiService.fetch(`/projects/${projectId}/issues/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        }),
        delete: async (projectId, id) => ApiService.fetch(`/projects/${projectId}/issues/${id}`, {
            method: 'DELETE'
        })
    })
}

module.exports = IssueService()
