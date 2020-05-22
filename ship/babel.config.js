const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const plugins = [[
    'import',
    {
        'libraryName': 'view-design',
        'libraryDirectory': 'src/components'
    }
]]
if (IS_PROD) {
    plugins.push('transform-remove-console')
    plugins.push('transform-remove-debugger')
}
module.exports = {
    'presets': [
        ['@vue/app', { 'useBuiltIns': 'entry' }]
    ],
    plugins
}
