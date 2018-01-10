/*
 * Requires:
 *	 psiturk.js
 *	 utils.js
 */

// The base URL for the external experiment. The PsiTurk UID will be appended to the end.
var experimentUrl = "http://localhost:5000?uid="

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;	// these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;	// they tell you which condition you have been assigned to

var currentview;

psiTurk.preloadPages(["frame.html"]);

// Listen for the 'experiment finished' message
$(window).on("message", function(event)
{
	event = event.originalEvent;
	if (event.data && typeof event.data === "string")
	{
		messageParts = event.data.split("|");
		if (messageParts[0] == "turkframe")
		{
			var messageData;
			if (messageParts[2])
			{
				messageData = JSON.parse(messageParts[2]);
			}
			
			switch(messageParts[1])
			{
				case "finished":
					if (messageData["sessionId"])
					{
						psiTurk.recordUnstructuredData("sessionId", messageData["sessionId"]);
						psiTurk.saveData();
					}
					psiTurk.completeHIT();
			}
		}
	}
});

// Show the iframe and focus it once loaded
$(window).on("load", function() {
	psiTurk.showPage("frame.html");
	$("#mainFrame").on("load", function(event) {
		if (event.target)
		{
			event.target.contentWindow.focus();
		}
	});
	$("#mainFrame").attr("src", experimentUrl + uniqueId)
});