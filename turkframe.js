/*
 * Library for working with Turkframe, a PsiTurk wrapper for use around separately hosted experiments.
 */

var Turkframe =
{

	// Check if the experiment is running inside an iframe.
	isFramed: function()
	{
		return window.self !== window.parent;
	},
	
	// Utility function to grab the value of a given parameter from the URL query string.
	// Returns the value if available or `false` if not.
	// NOTE: This may not handle every edge case. URLSearchParams isn't widely supported
	// yet, and this block isn't sophisticated enough to handle things like duplicate
	// parameters (you'll just get the first match). So keep it simple; make sure you're
	// passing a relatively clean query string. An example that works fine:
	// `?customStuff=hello%20world&psiturkUid=debug123abc:debug789xyz`.
	getQueryParam: function(param)
	{
		var queryString = window.location.search;
		var pattern = RegExp(param + "=([^&]+)", "g"); // whatever param followed by an equals sign followed by anything but an ampersand
		var matches = pattern.exec(queryString);
		if (matches && matches.length >= 2)
		{
			return decodeURIComponent(matches[1]); // given duplicates in the query string, just returns the first
		}
		return false;
	},
	
	// Returns the experiment's PsiTurk UID if it has one, or `false` if it doesn't.
	getUid: function()
	{
		var uid = this.getQueryParam("psiturkUid");
		if (uid) return uid;
		return false;
	},
	
	// Returns the experiment's PsiTurk wokerId if it has one, of `false` if it doesn't.
	getWorkerId: function()
	{
		var workerId = this.getQueryParam("psiturkWorkerId");
		if (workerId) return workerId;
		return false;
	},
	
	// Returns the experiment's PsiTurk condition if it has one, or `false` if it doesn't.
	getCondition: function()
	{
		var condition = this.getQueryParam("psiturkCondition");
		if (condition) return condition;
		return false;
	},
	
	// Returns the experiment's PsiTurk counterbalance if it has one, or `false` if it doesn't.
	getCounterbalance: function()
	{
		var counter = this.getQueryParam("psiturkCounter");
		if (counter) return counter;
		return false;
	},
	
	// Check if the experiment is running through Turkframe (i.e. is in an iframe and has a UID).
	inTurkframeMode: function()
	{
		return this.isFramed() && this.getUid();
	},

	// If we're running through Turkframe, send a message to the parent.
	// Messages have three parts: the `turkframe: true` flag so that Turkframe knows we sent
	// the message, the `message` property so that Turkframe knows what happened, and the
	// optional `data` object for passing additional information to Turkframe.
	messageUp: function(message, data)
	{
		if (this.inTurkframeMode())
		{
			message = {
				turkframe: true,
				message: message
			};
			if (data) message["data"] = data;
			window.parent.postMessage(message, "*");
		}
	},
	
	// If we're running through Turkframe, send a message to the parent that
	// the experiment is over, optionally passing along a data object.
	messageFinished: function(data)
	{
		this.messageUp("finished", data);
	},
};
