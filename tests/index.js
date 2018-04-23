import { chai, assert } from 'chai'
import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'

const HTTPWithPromise = function() {
    let params = Array.from(arguments)

    return new Promise((resolve, reject) => {
        params.push((err, res) => {
            if (err) {
                reject(err)
            }
            
            resolve(res)
        })

        HTTP.call.apply(null, params)
    })
}

describe('Service status', function() {
    this.timeout(30000)

    it('SSO is online', function() {
        return HTTPWithPromise('GET', 'https://id.zamphyr.tk').then(data => {
            assert.ok(data)
        })
    })

    it('API is online', function() {
        return HTTPWithPromise('GET', 'https://api.zamphyr.com').then(data => {
            assert.ok(data)
        })
    })
})
