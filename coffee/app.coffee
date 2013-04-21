App = Ember.Application.create
  VERSION: '0.1.0'
  NAME: 'Jobcash'
  LOG_TRANSITIONS: true

Ember.Application.initializer
  name: 'versions'
  initialize: ->
    Ember.debug "Accounting.VERSION : #{ accounting.version }"
    Ember.debug "#{ App.NAME }.VERSION : #{ App.VERSION }"
    Ember.debug '-------------------------------'

