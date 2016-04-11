// listen to events on an element, similar to `jQuery.on`
$( selector ).on(
	events,
	/***
		@[delegate]: including a selector here will listen for events on matching child elements 
	*/
	[delegate],
	callback
);