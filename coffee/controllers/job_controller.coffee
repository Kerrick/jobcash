App.JobController = Ember.ObjectController.extend
  salary: ( ->
    accounting.formatMoney @get('content.salary'), precision: 0
  ).property 'content.salary'
  health: ( ->
    result = @get('content.health')
    if result? then accounting.formatMoney result else 'Unknown'
  ).property 'content.health'

