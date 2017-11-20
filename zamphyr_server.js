Zamphyr = {}

OAuth.registerService('zamphyr', 2, null, (query) => {
    var tokens = getTokens(query)
    var identity = getIdentity(tokens.access_token)

    return {
        serviceData: {
            id: identity._id,
            accessToken: tokens.access_token,
            expires_in: tokens.expires_in
        },
        options: {
            profile: {
                name: identity.name,
                zamphyr_id: identity.id,
                country: identity.country,
                city: identity.city,
                picture: identity.picture,
                language: identity.language || 'en'
            },
            zamphyr: {
                tokens: tokens,
                identity: identity,
            }
        }
    }
})

const getTokens = (query) => {
    var config = ServiceConfiguration.configurations.findOne({
        service: 'zamphyr'
    })

    if (!config) {
        throw new ServiceConfiguration.ConfigError()
    }

    var response

    try {
        response = HTTP.post('https://id.zamphyr.com/oauth/token', {
            headers: {
              Accept: 'application/json'
            },
            params: {
              code: query['code'] || query['close?code'],
              client_id: config.clientId,
              client_secret: OAuth.openSecret(config.secret),
              redirect_uri: OAuth._redirectUri('zamphyr', config),
              state: query.state,
              grant_type: 'authorization_code'
            }
        })
    } catch (err) {
        throw _.extend(new Error(`Failed to complete OAuth handshake with Zamphyr. ${err.message}`), {
            response: err.response
        })
    }

    return response.data
}

const getIdentity = (accessToken) => {
    try {
        var response = HTTP.get('https://api.zamphyr.com/me', {params: {
            access_token: accessToken
        }})

        return response.data.data
    } catch (err) {
        throw _.extend(new Error(`Failed to fetch identity from Zamphyr. ${err.message}`), {
            response: err.response
        })
    }
}


Zamphyr.retrieveCredential = (credentialToken, credentialSecret) => {
    return OAuth.retrieveCredential(credentialToken, credentialSecret)
}

