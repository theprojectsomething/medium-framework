// gets a previously set property
var prop = $( selector ).prop( name );

// sets a property or list of properties and returns $( selector )
/***
	@[name]: this can be a string or {name: value} pairs
	@[value]: this is required if `name` is a string
*/
$( selector ).prop( name , [value] );