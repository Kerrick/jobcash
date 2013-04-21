App.ComparisonController = Ember.ArrayController.extend
  itemController: 'job'
  howMany: ( ->
    @get('content').length
  ).property 'content'

