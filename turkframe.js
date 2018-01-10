/*
 * Library for working with Turkframe, a wrapper for using self-hosted jsPsych apps with PsiTurk.
 */

var Turkframe = function()
{

	// Check if the experiment is running inside an iframe.
	this.isFramed = function()
	{
		return window.self !== window.parent;
	}

	// If we're running in an iframe (i.e. through turkframe), send a message to the parent.
	// These messages take the form of "turkframe|message|data", where the last term is an
	// optional string of JSON to be parsed later by the parent.
	this.messageUp = function(message, data)
	{
		if (this.isFramed())
		{
			messageText = "turkframe|" + message;
			if (data)
			{
				messageText += "|" + JSON.stringify(data)
			}
			window.parent.postMessage(messageText, "*");
		}
	};
	
	// Send as message to the parent that the experiment is over.
	this.messageFinished = function(data)
	{
		messageUp("finished", data);
	};

	return this;
};
