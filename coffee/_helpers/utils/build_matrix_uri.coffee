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

