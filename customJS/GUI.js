//GUI-related dynamism.

//Shows and hides match tabs.
function manageMatchScreenTabs(match, tab) {
	var selectedScreen = "matchTab" + tab;
	
	//Resetting everything.
	$(".matchNavbarElement" + match.id).hide();
	$(".matchNavbar" + match.id).removeClass("standardNavbarItemSelected" + match.id);
	
	//Doing CSS stuff
	$(".standardNavbarItem" + match.id).css({"background-color": "transparent", "color": "inherit"});
	
	//Depends on what was clicked.
	$("#" + selectedScreen + "Nav" + match.id).addClass("standardNavbarItemSelected" + match.id);
	$("#" + selectedScreen + match.id).show();
	
	$(".standardNavbarItemSelected" + match.id).css({"background-color": "#" + match.competition.colours[1], "color": "#" + match.competition.colours[0]});
}