App.JobController = Ember.ObjectController.extend
  salary: ( ->
    accounting.formatMoney @get('content.salary')
  ).property 'content.salary'

