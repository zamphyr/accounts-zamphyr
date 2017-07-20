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
                language: identity.language
            },
            zamphyr: {
                tokens: tokens,
                identity: identity,
            }
        }
    }
})

const getTokens = (query) => {
    let config = ServiceConfiguration.configurations.findOne({
        service: 'zamphyr'
    })

    if (!config) {
        throw new ServiceConfiguration.ConfigError()
    }

    let response
    try {
        response = HTTP.post('https://id.zamphyr.com/oauth/authorize', {
            headers: {
              Accept: 'application/json'
            },
            params: {
              code: query.code,
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

    if (!response.data.ok) {
        throw new Error(`Failed to complete OAuth handshake with Slack. ${response.data.error}`)
    } else {
        return response.data;
    }
}

const getIdentity = (accessToken) => {
    try {
        let response = HTTP.get('https://zamphyr.com/api/me', {params: {
            access_token: accessToken
        }})

        return response.data.ok && response.data
    } catch (err) {
        throw _.extend(new Error(`Failed to fetch identity from Slack. ${err.message}`), {
            response: err.response
        })
    }
}


Zamphyr.retrieveCredential = (credentialToken, credentialSecret) => {
    return OAuth.retrieveCredential(credentialToken, credentialSecret)
}

