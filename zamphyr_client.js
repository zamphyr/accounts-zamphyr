Zamphyr = {}

// Request Zamphyr credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Zamphyr.requestCredential = (options, credentialRequestCompleteCallback) => {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options
        options = {}
    }

    var config = ServiceConfiguration.configurations.findOne({
        service: 'zamphyr'
    })
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError())
        return
    }

    var credentialToken = Random.id()

    var scope = (options && options.requestPermissions) || []
    var flatScope = _.map(scope, encodeURIComponent).join(',') || 'identify'

    var loginStyle = OAuth._loginStyle('zamphyr', config, options)

    var loginUrl = `https://id.zamphyr.com/oauth/authorize?client_id=${config.clientId}&response_type=code&scope=${flatScope}&redirect_uri=${OAuth._redirectUri('zamphyr', config)}&state=${OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)}`


    OAuth.launchLogin({
        loginService: 'zamphyr',
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: {width: 900, height: 620}
    })
}
