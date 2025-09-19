/*
Basic page structure:

<div id="" data-role="page">
	<div data-role="header">
		<h1>Headline</h1>
	</div> <!-- /header -->
	
	<div role="main" class="ui-content ui-body-a">
		<!-- Content here -->
	</div> <!-- /content -->
	
	<div data-role="footer">
		<h4>Headline</h4>
	</div> <!-- /footer -->
</div> <!-- /page -->

*/

function goBack() {
	//Let's mix HTML's onclick with jQuery. What could possibly go wrong?
	window.history.back();
}

function playerGeneration() {
	if ($("#playerGeneratorPage").length == 0) {
		$("#mainMenu").after(`
			<div id="playerGeneratorPage" data-role="page">
				<div data-role="header">
					<h1>Player Generation</h1>
				</div> <!-- /header -->
				
				<div role="main" class="ui-content ui-body-a">
					` + generatePlayers(1000) + `<button onclick="goBack()">Return</button>
				</div> <!-- /content -->
				
				<div data-role="footer">
					<h4>Player Generation</h4>
				</div> <!-- /footer -->
			</div> <!-- /page -->
		`);
	}
	
	window.location.href = "#playerGeneratorPage";
}

function exampleMatch1() {
	var teams = generateMatchTeams();
	var matchCompetition = new Competition();
	
	//Match code stuff here.
	var match = new Match(
		teams = {
			"home": teams[0]
			,"away": teams[1]
		}
		,competition = matchCompetition
	);
	
	var sides = ["home", "away"];
	
	for (var i = 0; i < sides.length; i++) {
		match.teams[sides[i]].colours.general[0] = randomColour();
		match.teams[sides[i]].colours.general[1] = randomColour();
		match.teams[sides[i]].colours.home[0] = randomColour();
		match.teams[sides[i]].colours.home[1] = randomColour();
		match.teams[sides[i]].colours.away[0] = randomColour();
		match.teams[sides[i]].colours.away[1] = randomColour();
	}
	
	match.competition.colours[0] = randomColour();
	match.competition.colours[1] = randomColour();
	
	match.id = matches.length + 1;
	matches.push(match);
	
	simulateMatch(match);
	generateMatchPage(match);
}

function exampleLeague() {
	
}

function generateMatchPage(match) {
	if ($("#matchScreenPage" + match.id).length == 0) {
		$("#mainMenu").after(`<div id="matchScreenPage${match.id}" data-role="page"></div>`);
	}
	
	$("#matchScreenPage" + match.id).html(getMatchScreen(match));
	
	//Setting up colours.
	$(".standardNavbarItemSelected" + match.id).css({"background-color": "#" + match.competition.colours[1], "color": "#" + match.competition.colours[0]});
	$(".standardNavbarItem" + match.id).css("border-color", "#" + match.competition.colours[1]);
	
	//Setting up click functions.
	var tabs = [
		"Boxscore"
		,"LineUps"
		,"TeamStats"
		,"PlayerStats"
	];
	
	$("#matchTabBoxscoreNav" + match.id).click(function() {
		manageMatchScreenTabs(match, "Boxscore");
	});
	
	$("#matchTabLineUpsNav" + match.id).click(function() {
		manageMatchScreenTabs(match, "LineUps");
	});
	
	$("#matchTabTeamStatsNav" + match.id).click(function() {
			manageMatchScreenTabs(match, "TeamStats");
	});
	
	$("#matchTabPlayerStatsNav" + match.id).click(function() {
		manageMatchScreenTabs(match, "PlayerStats");
	});
	
	window.location.href = "#matchScreenPage" + match.id;
}

function teamGeneration() {
	if ($("#teamGeneratorPage").length == 0) {
		$("#mainMenu").after(`
			<div id="teamGeneratorPage" data-role="page">
				<div data-role="header">
					<h1>Team Generation</h1>
				</div> <!-- /header -->
				
				<div role="main" class="ui-content ui-body-a">
					<div id="teamLineUp"></div>
					<button onclick="goBack()">Return</button>
				</div> <!-- /content -->
				
				<div data-role="footer">
					<h4>Team Generation</h4>
				</div> <!-- /footer -->
			</div> <!-- /page -->
		`);
	}
	
	var team = new Team();
	generateTeam(team);
	
	$("#teamLineUp").html(getTeamLineUp(team));
	
	window.location.href = "#teamGeneratorPage";
}

function newGame() {
	//Checking if the page exists.
	if ($("#newGamePage").length == 0) {
		$("#mainMenu").after(`
			<div id="newGamePage" data-role="page">
				<div data-role="header">
					<h1>New Game</h1>
				</div> <!-- /header -->
				
				<div role="main" class="ui-content ui-body-a">
					<button onclick="playerGeneration()">Generate Players</button>
					<button onclick="teamGeneration()">Generate Team</button>
					<button onclick="exampleMatch1()">Example Match</button>
					<button onclick="exampleLeague()">Example League</button>
					<button onclick="goBack()">Return</button>
				</div> <!-- /content -->
				
				<div data-role="footer">
					<h4>New Game</h4>
				</div> <!-- /footer -->
			</div> <!-- /page -->
		`);
	}
	
	window.location.href = "#newGamePage";
}

function loadGame() {
	alert("Work in progress");
}

$(document).ready(function() {
	$("#newgame").click(function() {
		newGame()
	});
	$("#loadgame").click(function() {
		loadGame()
	});
});
