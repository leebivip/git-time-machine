var _          = require('underscore')
  , Backbone   = require('backbone')
  , plugin     = require('plugin')
Backbone.$ = require('jquery')

var Commit = require('../models/commit')

module.exports = Backbone.View.extend({
  el: '#content'
, template: require('../templates/commit')
, initialize: function(opts) {
    var _this = this
      , commit = new Commit(opts)
    commit.fetch({
      success: function(commit) {
        _this.render(commit.attributes)
      }
    })
  }
, render: function(commit) {
    $(this.el).html(this.template(commit))
  }
})
