// HELPERS
var parseQueryString = require('./helpers').parseQueryString
  , auth = require('./lib/auth')

// MODELS
var Commit = require('./models/commit')
  , CommitsList = require('./models/commits_collection')

// VIEWS
var IndexView = require('./views/index_view')
  , UserView = require('./views/user')
  , UsersView = require('./views/users')
  , CommitView = require('./views/commit')
  , CommitsView = require('./views/commits')
  , NotFoundView = require('./views/not_found')

module.exports = Backbone.Router.extend({
  routes: {
    '': 'index'
  , 'auth(/)(?*queryString)': 'auth'
  , 'signin(/)': 'signin'
  , 'signout(/)': 'signout'
  , 'users/:username(/)': 'user'
  , 'users(/)': 'users'
  , ':owner/:repo/blob/:sha/*path': 'commits'
  , '*path': 'notFound'
  }
, index: function() {
    new IndexView({ el: '#content' })
  }
, auth: function(queryString) {
    var params = parseQueryString(queryString)
      , _this = this
      , dest = decodeURIComponent(window.readCookie('lastUrl')) || '/'

    if (params.code) {
      console.log('AUTH: getting token')
      auth.fetchToken(params.code, function() {
        console.log('Redirecting to:', dest)
        _this.navigate(dest, { trigger: true })
      })
    } else {
      console.error('No code parameter provided')
      // this.signin()
    }
  }
, signin: function() {
    var token = auth.getToken()
    if (token) {
      console.log('AUTH: token exists!')
      this.navigate('/', { trigger: true })
    } else {
      console.log('AUTH: no token, sign in')
      auth.authenticate()
    }
  }
, signout: function() {
    auth.destroy()
    this.navigate('/', { trigger: true })
  }
, users: function() {
    new UsersView()
  }
, user: function(username) {
    new UserView({ username: username })
  }
, commits: function(owner, repo, sha, path) {
    if (!path) return console.error('no path detected!');
    console.log('getting commits')
    var commits = new CommitsList([], {
      owner: owner
    , repo: repo
    , path: path
    , sha: sha
    })
    commits.fetch({
      success: function(commits) {
        new CommitsView({ collection: commits })
      }
    , error: function(err) {
        console.log(err)
        new NotFoundView().render()
      }
    })
  }
, notFound: function() {
    new NotFoundView().render()
  }
})
