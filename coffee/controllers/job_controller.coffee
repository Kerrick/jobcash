App.JobController = Ember.ObjectController.extend
  salary: ( ->
    accounting.formatMoney @get('content.salary'), precision: 0
  ).property 'content.salary'

