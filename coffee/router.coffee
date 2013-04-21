App.Router = Ember.Router.extend
  location: 'history'

App.Router.map( ->
  @route 'comparison', path: '/compare/:jobs'
  @route 'job', path: '/job/:stats'
)

App.JobRoute = Ember.Route.extend
  model: (params) -> utils.parseMatrixURI(params.stats)[0]
  serialize: (model) -> stats: utils.buildMatrixURI model

App.ComparisonRoute = Ember.Route.extend
  model: (params) -> App.Job.create job for job in utils.parseMatrixURI params.jobs
  redirect: (model) -> @transitionTo 'job', model[0] if model.length is 1
  serialize: (model) -> jobs: utils.buildMatrixURI.apply model

