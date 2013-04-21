App.JobController = Ember.ObjectController.extend
  prettySalary: ( ->
    accounting.formatMoney @get('content.salary'), precision: 0
  ).property 'content.salary'

