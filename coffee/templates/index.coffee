Ember.TEMPLATES['application'] = Ember.Handlebars.compile('
<h1>{{#linkTo "index"}}{{App.NAME}}{{/linkTo}}</h1>
<p>{{App.NAME}} v{{App.VERSION}}</p>
{{outlet}}
')

