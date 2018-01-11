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

psiTurk.preloadPages(["frame.html"]);

// Listen for the 'experiment finished' message from the framed experiment
$(window).on("message", function(event)
{
	event = event.originalEvent; // Get rid of the jQuery wrapper
	if (event.data && event.data["turkframe"] && event.data["turkframe"] === true)
	{
		switch (event.data["message"])
		{
			case "finished":
				if (event.data["data"])
				{
					Object.keys(event.data["data"]).forEach(function(key)
					{
						psiTurk.recordUnstructuredData(key, event.data["data"][key]);
					});
				}
				psiTurk.saveData();
				psiTurk.completeHIT();
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
