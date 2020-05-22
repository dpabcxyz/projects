export const replaceApi = (url, params) => {
    var tmpUrl = url.replace(/\{.+?\}/g, match => {
        return params[match.replace(/[{|}]/g, '')] || ''
    })
    return tmpUrl
}
