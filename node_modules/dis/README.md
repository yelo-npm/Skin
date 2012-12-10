# is

Tiny tiny Library to check object types.
Works in node and your browser.

Use it like this:

    is.object(var)

OR

	is(var,"object")

OR

	is(var, Object)

all are equally valid, but note that is.object will have more checks that is(var, Object).
You can also do:
	
	 is(var) to get it's type
	 is(var1,var2,var3,Array) to check several variables at the same time

## Installation:

### In browser:
	
	<script type="text/javascript" src="dis"></script>

or

	require('dis',function(is){
		//...
	})

### In node:
	
	var is = require('dis');

note: I use "is" because it's shorter and more explicative. This is how I had named the plugin originally, but the name was not available on npm, so I had to revert to something else.
the original "is" plugin is available <https://github.com/onirame/is>. It's sorta similar, but has more functions, and a different API. See if you like it better.

## List of functions:

	 is.object(var): checks if var is a plain object
	 is.array(var): checks if var is an array
	 is.boolean(var): checks if var is a boolean
	 is.function(var): checks if var is a function
	 is.string(var): checks if var is a string
	 is.empty(var): checks if var is defined, an empty string, an array with no length, or an empty object
	 is.defined(var): checks if var is null or undefined
	 is.number(var): checks if var is a number
	 is.integer(var): checks if var is an integer
	 is.HTMLCollection(var): checks if var is the result of a selector (browser only of course).					   
	 is.arguments(var): checks if var is an arguments object
	 is.node(var): checks if var is a dom node (browser only)
	 is.regexp(var): checks if var is a regular expression
	 is.same(var, var...): checks if all passed variables have the same type, without specifying the type
	 is.type(var): returns the type of var
	 is(var): same as above
	 is(var,type): checks if "var" is of type "type"
	 is(var, var..., type): bundles is(var,type) and is.same. Checks if all passed vars have the same type and finally checks the type
