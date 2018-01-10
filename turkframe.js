/*
 * Library for working with Turkframe, a wrapper for using self-hosted jsPsych apps with PsiTurk.
 */

var Turkframe = function()
{

	this.messageUp = function(message)
	{
		// If we're running in an iframe (i.e. through turkframe), tell the parent that we're done.
		// These messages can be anything in the "turkframe|xyz" form, where "xyz" is the message.
		if (window.self !== window.parent)
		{
			window.parent.postMessage("turkframe|" + message, "*");
		}
	};
	
	this.messageFinished = function()
	{
		messageUp("finished");
	};

	return this;
};
