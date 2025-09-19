//Functions which generate HTML.

function generatePlayers(amount) {
	var html = "<table><tr><th>Name</th><th>Nationality</th><th>Positions</th><th>Offensive Ability</th><th>Defensive Ability</th></tr>";
	
	var player = null;
	
	for (var i = 0; i < amount; i++) {
		player = createPlayer();
		
		html += getPlayerTableInfo(player);
	}
	
	html += "</table>";
	
	return html;
}

function getPlayerTableInfo(player) {
	string = `<tr><td>` + getPersonFullname(player) + `</td>
		<td>` + getPersonNationality(player) + `</td>
		<td>` + getPlayerPosition(player) + `</td>
		<td>` + Math.floor(player.offensive_skill) + `</td>
		<td>` + Math.floor(player.defensive_skill) + `</td>
		</tr>`;
	
	return string;
}

function generatePlayerTable(playerArray) {
	var string = "<table><tr><th>Name</th><th>Nationality</th><th>Positions</th><th>Offensive Ability</th><th>Defensive Ability</th></tr>";
	
	for (var i = 0; i < playerArray.length; i++) {
		string += getPlayerTableInfo(playerArray[i]);
	}
	
	string += "</table>";
	
	return string;
}

function getMatchScreen(match) {
	var html = `
		<div data-role="header" style="background-color: #${match.competition.colours[0]}; color: #${match.competition.colours[1]}">
			<table class="matchScoreTable">
				<tr>
					<td rowspan="2" class="matchTeamName matchHomeTeamName" id="matchTeamHome${match.id}" style="background-color: #${match.teams.home.colours.home[0]};color: #${match.teams.home.colours.home[1]};">${match.teams.home.fullname}</td>
					<td class="matchMainScore matchTotalScore" id="matchTotalScore${match.id}">${getFinalScoreString(match)}</td>
					<td rowspan="2" class="matchTeamName matchAwayTeamName" id="matchTeamAway${match.id}" style="background-color: #${match.teams.away.colours.away[0]};color: #${match.teams.away.colours.away[1]};">${match.teams.away.fullname}</td>
				</tr><tr>
					<td class="matchMainScore matchPeriodScore" id="matchPeriodScore${match.id}">${matchGetPeriodScores(match)}</td>
				</tr>
			</table>
		</div>
		<div role="main" class="ui-content ui-body-a"  style="background-color: #${match.competition.colours[0]}; color: #${match.competition.colours[1]}">
			<div data-role="navbar" data-grid="c">
				<ul class="standardNavbar">
					<li id="matchTabBoxscoreNav${match.id}" class="matchNavbar${match.id} standardNavbarItem standardNavbarItem${match.id} standardNavbarItemSelected${match.id}">Boxscore</li>
					<li id="matchTabLineUpsNav${match.id}" class="matchNavbar${match.id} standardNavbarItem standardNavbarItem${match.id}">Line-ups</li>
					<li id="matchTabTeamStatsNav${match.id}" class="matchNavbar${match.id} standardNavbarItem standardNavbarItem${match.id}">Team Stats</li>
					<li id="matchTabPlayerStatsNav${match.id}" class="matchNavbar${match.id} standardNavbarItem standardNavbarItem${match.id}">Player Stats</li>
				</ul>
			</div>
			<div id="matchTabBoxscore${match.id}" class="matchNavbarElement${match.id} matchTab">
				<table class="matchBoxScoreTable">
					${getMatchEvents(match)}
				</table>
			</div>
			<div id="matchTabLineUps${match.id}" class="matchNavbarElement${match.id} matchTab" style="display:none">
				${getTeamLineup(match.teams.home, match.lineup.home)}
				${getTeamLineup(match.teams.away, match.lineup.away)}
			</div>
			<div id="matchTabTeamStats${match.id}" class="matchNavbarElement${match.id} matchTab" style="display:none">
				${getTeamMatchStats(match)}
			</div>
			<div id="matchTabPlayerStats${match.id}" class="matchNavbarElement${match.id} matchTab" style="display:none">
				${getTeamPlayerMatchStats(match.teams.home)}
				${getTeamPlayerMatchStats(match.teams.away)}
			</div>
		</div>
	`;
	
	return html;
}

function getTeamLineup(team, lineup) {
	var html = `
		<p class="matchLineUpTeamName">${team.fullname} Line-up</p>
	`;
	
	for (var i = 0; i < lineup.lines.length; i++) {
		html += getLineString(lineup.lines[i]);
	}
	
	html += `
		<table class="matchLineUpTable">
			<tr>
				<th class="matchLineUpGKs" rowspan="2">Goalkeepers</th>
				${getGoalieLineupString(lineup.goalies[0])}
			</tr><tr>
				${getGoalieLineupString(lineup.goalies[1])}
			</tr>
		</table>
	`;
	
	return html;
}

function getGoalieLineupString(gk) {
	return `<td class="matchLineUpGK matchLineUpGKs">${getPersonShortname(gk)}</td>`;
}