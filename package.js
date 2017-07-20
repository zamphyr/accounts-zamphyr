Package.describe({
    summary: 'Login service for Zamphyr accounts',
    version: '0.0.3',
    git: 'https://github.com/zamphyr/accounts-zamphyr.git',
    name: 'zamphyr:accounts-zamphyr'
})

Package.on_use(function(api) {
    api.versionsFrom('METEOR@0.9.0')
    api.use('oauth2', ['client', 'server'])
    api.use('oauth', ['client', 'server'])
    api.use('http', ['server'])
    api.use('templating', 'client')
    api.use('underscore', 'client')
    api.use('random', 'client')
    api.use('service-configuration', ['client', 'server'])
    api.use('accounts-base', ['client', 'server'])
    api.use('accounts-oauth', ['client', 'server'])

    api.add_files('zamphyr_server.js', 'server')

    api.add_files(['zamphyr_login_button.css', 'zamphyr_client.js', 'zamphyr_configure.html', 'zamphyr_configure.js'], 'client')

    api.add_files('zamphyr.js')
})
