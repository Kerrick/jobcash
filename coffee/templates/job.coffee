Ember.TEMPLATES['job'] = Ember.Handlebars.compile('
<h2>Job</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Job</th>
      <th scope="col">Salary</th>
      <th scope="col">401k Match</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">{{#linkTo job this}}{{title}}{{/linkTo}}</th>
      <td>{{salary}}</td>
      <td>{{401k}}</td>
    </tr>
  </tbody>
</table>
')

