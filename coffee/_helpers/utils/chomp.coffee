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

