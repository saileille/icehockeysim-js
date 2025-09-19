//Functions

function separatePlayers(team) {
	//Separates skaters and goalkeepers. Whenever changes occur to the player list of a team, this function must be run.
	
	team.separated_players = {
		"skaters": []
		,"goalies": []
	};
	
	var player;
	
	for (var i = 0; i < team.players.length; i++) {
		player = team.players[i];
		if (player.positions[0].abbreviation == "GK") {
			team.separated_players.goalies.push(player);
		}
		else {
			team.separated_players.skaters.push(player);
		}
	}
	
	orderPlayers(team.separated_players);
}

function fillTeam(team, gk=2, ld=4, rd=4, lw=4, c=4, rw=4) {
	//Populates the team with players.
	//The parametres determine how many players get generated.
	//WARNING: This function replaces all team's players with new ones. Should only be used at the start of a new game/as a test.
	
	team.players = [];
	var player = null;
	
	for (var i = 0; i < gk; i++) {
		player = createPlayer("GK", team.stature);
		team.players.push(player);
	}
	
	for (var i = 0; i < ld; i++) {
		player = createPlayer("LD", team.stature);
		team.players.push(player);
	}
	
	for (var i = 0; i < rd; i++) {
		player = createPlayer("RD", team.stature);
		team.players.push(player);
	}
	
	for (var i = 0; i < lw; i++) {
		player = createPlayer("LW", team.stature);
		team.players.push(player);
	}
	
	for (var i = 0; i < c; i++) {
		player = createPlayer("C", team.stature);
		team.players.push(player);
	}
	
	for (var i = 0; i < rw; i++) {
		player = createPlayer("RW", team.stature);
		team.players.push(player);
	}
}

function getLines(team) {
	//Makes lines based on what kind of players the team has.
	//Presumes the team has players already.
	
	team.lines = [];
	
	//Populating the team with four lines.
	for (var i = 0; i < 4; i++) {
		team.lines.push(copyLine(RINK_POSITIONS, 5, orderNr=i+1));
	}
	
	var players = orderPlayers(team.separated_players);
	
	for (var i = 0; i < 2 && i < players.goalies.length; i++) {
		team.goalkeepers.push(players.goalies[i]);
	}
	
	var skater;
	var line;
	var playerPosition;
	var linePosition;
	var positionIndex;
	
	var positionFilled;
	
	for (var i = 0; i < players.skaters.length; i++) {
		//Looping through players.
		positionFilled = false;
		skater = players.skaters[i];
		playerPosition = skater.positions[0].abbreviation;
		
		for (var i2 = 0; i2 < team.lines.length && !positionFilled; i2++) {
			//Looping through lines.
			line = team.lines[i2].positions.object_array;
			
			for (var i3 = 0; i3 < line.length; i3++) {
				//Looping through positions.
				linePosition = line[i3].abbreviation;
				
				if (playerPosition == linePosition) {
					
					//Checking if the slot in this line is vacant.
					if (!line[i3].player) {
						line[i3].player = skater;
						positionFilled = true;
					}
					break;
				}
			}
		}
	}
}

function getActiveLine(team) {
	//Primitive way to select a line to use.
	
	var index = weightedListRandom([4, 3, 2, 1]);
	team.active_line = team.lines[index];
}

//Getters

function getTeamLineUp(team) {
	//Returns the line-up in HTML.
	
	var html = team.fullname + " Roster:<br><br>";
	
	html += generatePlayerTable(team.players);
	html += "<br><br>Line-up:<br><br>Goalkeepers:<br>";
	html += generatePlayerTable(team.goalkeepers);
	html += "<br>";
	
	for (var i = 0; i < team.lines.length; i++) {
		if (i > 0) {
			html += "<br>";
		}
		
		html += "Line " + (i+1) + ":<br>";
		html += getLineString(team.lines[i]);
	}
	
	return html;
}

function getTeamMatchShots(team) {
	var value = 0;
	
	for (var i = 0; i < team.players.length; i++) {
		value += team.players[i].match_stats.shots;
	}
	
	return value;
}

function getTeamMatchShotPct(team) {
	return convertToPct(getTeamMatchGoals(team.match_stats) / getTeamMatchShots(team));
}

function getTeamPlayerMatchStats(team) {
	var html = `
		<table class="matchPlayerStatTable">
			<caption class="matchPlayerStatTeam">${team.fullname} Players</caption>
			<tr>
				<th class="matchPlayerStatTableName">Name</th>
				<th>Pos</th>
				<th>TOI</th>
				<th>G</th>
				<th>A</th>
				<th>Pts</th>
				<th>+/-</th>
				<th>SOG</th>
				<th>SH%</th>
			</tr>
	`;
	
	var player;
	
	for (var i = 0; i < team.separated_players.skaters.length; i++) {
		player = team.separated_players.skaters[i];
		html += `
			<tr>
				<td>${getPersonShortname(player)}</td>
				<td class="matchPlayerStatTableCell">${getPlayerPosition(player)}</td>
				<td class="matchPlayerStatTableCell">${secondsToTime(player.match_stats.time_on_ice)}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.goals}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.assists}</td>
				<td class="matchPlayerStatTableCell">${getPlayerMatchPoints(player.match_stats)}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.plus_minus}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.shots}</td>
				<td class="matchPlayerStatTableCell">${getPlayerShotPct(player.match_stats)}</td>
			</tr>
		`;
	}
	
	html += `</table><table class="matchPlayerStatTable">
		<tr>
			<th class="matchPlayerStatTableName">Name</th>
			<th>Pos</th>
			<th>TOI</th>
			<th>S</th>
			<th>GA</th>
			<th>SA%</th>
		</tr>
	`;
	
	for (var i = 0; i < team.separated_players.goalies.length; i++) {
		player = team.separated_players.goalies[i];
		html += `
			<tr>
				<td>${getPersonShortname(player)}</td>
				<td class="matchPlayerStatTableCell">${getPlayerPosition(player)}</td>
				<td class="matchPlayerStatTableCell">${secondsToTime(player.match_stats.time_on_ice)}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.saves}</td>
				<td class="matchPlayerStatTableCell">${player.match_stats.conceded}</td>
				<td class="matchPlayerStatTableCell">${getGoalieSavePct(player.match_stats)}</td>
			</tr>
		`;
	}
	
	html += "</table>";
	
	return html;
}