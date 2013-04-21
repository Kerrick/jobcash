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

utils = -> true

# Parses a segment of a Matrix URI into an array of objects.
# @param   {String}  uri   The string to be parsed
# @return  {Array}         An array of objects with keys and values
# @method
# @example                 Using utils.parseMatrixURI
#          utils.parseMatrixURI('one=two;three=four&five=six;seven=eight');
#          //=> [{one: 'two', three: 'four'}, {five: 'six', seven: 'eight'}]
utils.parseMatrixURI = (uri) ->
  matrices = []
  parts = uri.split '&'

  for part in parts
    pairs = part.split ';'
    params = {}

    for pair in pairs
      split = pair.split '='
      value = split[1]
      value = +value unless isNaN value
      params[split[0]] = value

    matrices.push params

  matrices

# Builds a segment of a Matrix URI from an array of objects.
# @param   {Object}   ...  One or more objects with keys and values
# @return  {String}        The Matrix URI segment that was built
# @method
# @example                 Using utils.parseMatrixURI
#          utils.parseMatrixURI({one: 'two', three: 'four'}, {five: 'six', seven: 'eight'});
#          //=> 'one=two;three=four&five=six;seven=eight'
utils.buildMatrixURI = (objects...) ->
  return '' if objects.length is 0
  str = ''

  for object in objects

    for own key, value of object
      if typeof value is 'string' or typeof value is 'number'
        str += "#{ key }=#{ value };"
      else if typeof value is 'undefined'
        str += "#{ key };"

    str = "#{ utils.chomp str, ';' }&"

  utils.chomp str, '&'

# Chomps something (by default, a newline) off of the end of a string.
# Inspired by ruby's String#chomp
# @param   {String}  wholeString     The string to be chomped
# @param   {String}  [chompString]   What to chomp off of wholeString -- defaults to "\n"
# @method
# @example                           Using utils.chomp
#          utils.chomp("hello")
#          //=> "hello"
#          utils.chomp("hello\n")
#          //=> "hello"
#          utils.chomp("hello", "llo")
#          //=> "he"
#          utils.chomp("hello", "there")
#          //=> "hello"
utils.chomp = (wholeString, chompString = "\n") ->
  negChompLength = -1 * chompString.length
  if wholeString.slice(negChompLength) isnt chompString
    wholeString
  else
    wholeString.slice 0, negChompLength

App.Router = Ember.Router.extend
  location: 'history'

App.Router.map( ->
  @route 'comparison', path: '/compare/:jobs'
  @route 'job', path: '/job/:stats'
)

App.Job = Ember.Object.extend()

App.JobRoute = Ember.Route.extend
  model: (params) ->
    utils.parseMatrixURI(params.stats)[0]
  serialize: (model) ->
    stats: utils.buildMatrixURI model

App.JobController = Ember.ObjectController.extend
  salary: ( ->
    accounting.formatMoney @get('content.salary')
  ).property 'content.salary'

App.ComparisonRoute = Ember.Route.extend
  model: (params) ->
    App.Job.create job for job in utils.parseMatrixURI params.jobs
  serialize: (model) ->
    jobs: utils.buildMatrixURI.apply model

App.ComparisonController = Ember.ArrayController.extend
  itemController: 'job'

