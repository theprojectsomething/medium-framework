// stop listening to events on an element, similar to `jQuery.off`
$( selector ).off(
	events,
	/***
		@[callback]: excluding this will remove all matching listeners
	*/
	[callback]
);