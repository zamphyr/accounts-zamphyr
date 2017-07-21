Accounts.oauth.registerService('zamphyr')

if (Meteor.isClient) {
    Meteor.loginWithZamphyr = (options, callback) => {
        if (!callback && typeof options === 'function') {
            callback = options
            options = null
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback)
        Zamphyr.requestCredential(options, credentialRequestCompleteCallback)
    }
} else {
    Accounts.addAutopublishFields({
        forLoggedInUser: ['services.zamphyr'],
        forOtherUsers: ['services.zamphyr.id']
    })
}
