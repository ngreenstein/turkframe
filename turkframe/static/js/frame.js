/*
 * Requires:
 *	 psiturk.js
 *	 utils.js
 */

// Initalize the psiturk object and preload the frame page
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);
psiTurk.preloadPages(["frame.html"]);

// Keep track of whether the page is ready or not
var _tf_pageReady = false;
$(document).on("ready", function() {
	_tf_pageReady = true;
});

// Utility function to build the query string for the framed experiment
var _tf_appendPsiturkParamsToUrl = function(url)
{
	var params = {
		psiturkUid: uniqueId,
		psiturkCondition: condition,
		psiturkCounter: counterbalance
	};
	var queryString = $.param(params);
	return url += queryString;
};

// Array of objects representing message handlers
var _tf_messageHandlers = [];

// Register a new message handler object (must have the following structure):
// {message: "my message", handler: function(messageData) {...}}
// Returns true if successful (i.e. handler was valid) and false if not.
// Note: multiple handlers can exist for the same message and will all be called,
// but you cannot be sure of the order in which they will run.
var tf_registerMessageHandler = function(handlerObj)
{
	if (handlerObj
		&& handlerObj["message"] && typeof handlerObj["message"] === "string"
		&& handlerObj["handler"] && typeof handlerObj["handler"] === "function"
	)
	{
		_tf_messageHandlers.push(handlerObj);
		return true;
	}
	return false;
};

// De-register an existing message handler. Returns true if the handler was
// sucessfully removed, or false if it wasn't registered to begin with.
var tf_deRegisterMessageHandler = function(handlerObj)
{
	var handlerIndex = _tf_messageHandlers.indexOf(handlerObj);
	if (handlerIndex >= 0)
	{
		_tf_messageHandlers.splice(handlerIndex, 1);
		return true;
	};
	return false;
};

// Handle an incoming message
var _tf_handleMessage = function(messageObj)
{
	var message = messageObj["message"];
	var messageData = messageObj["data"] ? messageObj["data"] : {};
	for (var i = 0; i < _tf_messageHandlers.length; i ++)
	{
		var thisHandler = _tf_messageHandlers[i];
		if (thisHandler.message == message)
		{
			thisHandler.handler.call(this, messageData);
		}
	}
};

// Kick things off once customization/setup has been taken care of.
var tf_init = function()
{
	
	// Register a handler for the 'finished' message to save data and end the experiment.
	tf_registerMessageHandler({
		message: "finished",
		handler: function(data)
		{
			Object.keys(data).forEach(function(key)
			{
				psiTurk.recordUnstructuredData(key, data[key]);
			});
			psiTurk.saveData();
			psiTurk.completeHIT();
		}
	});
	
	// Start listening for messages from the framed experiment
	$(window).on("message", function(event)
	{
		event = event.originalEvent; // Get rid of the jQuery wrapper
		if (event.data && event.data["turkframe"] && event.data["turkframe"] === true && event.data["message"])
		{
			_tf_handleMessage(event.data);
		}
	});
	
	// If the document is ready, show the iframe and focus it. If not, do so when it is.
	var readyWork = function()
	{
		psiTurk.showPage("frame.html");
		$("#mainFrame").on("load", function(event) {
			if (event.target)
			{
				event.target.contentWindow.focus();
			}
		});
		$("#mainFrame").attr("src", _tf_appendPsiturkParamsToUrl(tf_experimentUrl));
	};
	if (_tf_pageReady)
	{
		readyWork();
	}
	else
	{
		$(document).on("ready", function() {
			readyWork();
		});
	}
};
