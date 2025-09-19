//Match class functions and getters

//Functions

function simulateMatch(match) {
	resetMatchStats(match.teams);
	getStartingLineup(match);
	
	do {
		if (match.time >= 1200) {
			match.period++;
			match.time = 0;
			updateGoalsPerPeriod(match);
		}
		
		progressInMatch(match);
	}
	while (getMatchContinuity(match));
}

function progressInMatch(match) {
	//One second forward.
	match.time++;
	
	//Updates lines to be used here.
	getActiveLine(match.teams.home);
	getActiveLine(match.teams.away);
	
	addToIceTime(match.teams);
	
	//Determines which team gets possession.
	determinePuckPossession(match);
	
	//Shooting chance.
	var shot = shootingChance(match);
	
	if (shot) {
		//Successful shot in.
		shotEvent(match);
	}
}

function getStartingLineup(match) {
	match.lineup = {
		"home": {
			"lines": []
			,"goalies": []
		}
		,"away": {
			"lines": []
			,"goalies": []
		}
	}
	
	var line;
	var gk;
	
	for (var i = 0; i < match.teams.home.lines.length; i++) {
		line = match.teams.home.lines[i];
		match.lineup.home.lines.push(copyLine(line.positions, line.opponent_number, line.order_number));
	}
	
	for (var i = 0; i < match.teams.home.goalkeepers.length; i++) {
		gk = match.teams.home.goalkeepers[i];
		match.lineup.home.goalies.push(copy(gk));
	}
	
	for (var i = 0; i < match.teams.away.lines.length; i++) {
		line = match.teams.away.lines[i];
		match.lineup.away.lines.push(copyLine(line.positions, line.opponent_number, line.order_number));
	}
	
	for (var i = 0; i < match.teams.away.goalkeepers.length; i++) {
		gk = match.teams.away.goalkeepers[i];
		match.lineup.away.goalies.push(copy(gk));
	}
}

function determinePuckPossession(match) {
	var home = match.teams.home.active_line;
	var away = match.teams.away.active_line;
	
	var puck = randomBinaryOutcome([getLineTotalStrength(home), getLineTotalStrength(away)]);
	
	if (puck) {
		setMatchDefOff(match, "home", "off");
	}
	else {
		setMatchDefOff(match, "away", "off");
	}
	
	match.teams[match.on_offence].match_stats.time_on_puck++;
}

function shootingChance(match) {
	var off = getLineStrength(match.teams[match.on_offence].active_line, "off");
	var def = getLineStrength(match.teams[match.on_defence].active_line, "def");
	
	var shot = randomBinaryOutcome([off, def], BASE_SHOT_CHANCE);
	
	return shot;
}

function shotEvent(match) {
	//Determines if there is a goal or not.
	
	//The ones who would be scoring.
	var potentialScorers = getGoalAttempters(match);
	potentialScorers[0].match_stats.shots++;
	
	//Gets a number scaled to make it fair for the goalkeeper.
	var offPower = getShooterSkills(potentialScorers);
	
	//The goalkeeper who will attempt to save it.
	var gk = match.teams[match.on_defence].goalkeepers[0];
	
	//true = goal; false = no goal
	var goal = randomBinaryOutcome([offPower, gk.adjust_def_skill], BASE_GOAL_CHANCE);
	
	if (goal) {
		newGoal(match, potentialScorers);
	}
	else {
		match.teams[match.on_defence].goalkeepers[0].match_stats.saves++;
	}
}

function newGoal(match, scorers) {
	//A new goal got scored.
	
	var goal = new Goal(
		time = match.time
		,period = match.period
		,team = match.on_offence
		,scorer = scorers[0]
		,assists = []
		,offence_line = match.teams[match.on_offence].active_line.positions.object_array
		,defence_line = match.teams[match.on_defence].active_line.positions.object_array
		,goalkeeper = match.teams[match.on_defence].goalkeepers[0]
	);
	
	//Starting from 1 because the scorer has been noted already.
	for (var i = 1; i < scorers.length; i++) {
		goal.assists.push(scorers[i]);
	}
	
	updatePlayerStatsAfterGoal(goal);
	updateGoals(match);
	
	goal.scoreline = matchGetTotalScore(match);
	match.goals.push(goal);
}

function updateGoals(match) {
	//ONLY USE THIS WHEN A GOAL GETS SCORED, AS IT ADDS A GOAL
	match.teams[match.on_offence].match_stats.goals_per_period[match.period - 1]++;
}

function updateGoalsPerPeriod(match) {
	while (match.teams.home.match_stats.goals_per_period.length < match.period) {
		match.teams.home.match_stats.goals_per_period.push(0);
		match.teams.away.match_stats.goals_per_period.push(0);
	}
}

function updatePlayerStatsAfterGoal(goal) {
	//Updates +/- statistics for all players in the rink.
	
	//Goalkeeper gets the goal conceded in their statistics.
	goal.goalkeeper.match_stats.conceded++;
	goal.scorer.match_stats.goals++;
	
	for (var i = 0; i < goal.assists.length; i++) {
		goal.assists[i].match_stats.assists++;
	}
	
	for (var i = 0; i < goal.offence_line.length; i++) {
		goal.offence_line[i].player.match_stats.plus_minus++;
		goal.defence_line[i].player.match_stats.plus_minus--;
	}
}

function addToIceTime(teams) {
	//Adds ice time for those on ice.
	
	//ONLY WORKS LIKE THIS WHEN THERE ARE NO PENALTIES
	for (var i = 0; i < teams.home.active_line.positions.object_array.length; i++) {
		teams.home.active_line.positions.object_array[i].player.match_stats.time_on_ice++;
		teams.away.active_line.positions.object_array[i].player.match_stats.time_on_ice++;
	}
	
	teams.home.goalkeepers[0].match_stats.time_on_ice++;
	teams.away.goalkeepers[0].match_stats.time_on_ice++;
}

function resetMatchStats(teams) {
	teams.home.match_stats = new TeamMatchStats();
	teams.away.match_stats = new TeamMatchStats();
	
	for (var i = 0; i < teams.home.players.length; i++) {
		teams.home.players[i].match_stats = new PlayerMatchStats();
	}
	
	for (var i = 0; i < teams.away.players.length; i++) {
		teams.away.players[i].match_stats = new PlayerMatchStats();
	}
}

function setMatchDefOff(match, side, setValue) {
	if (
		(
			side == "home"
			&& setValue == "off"
		) || (
			side == "away"
			&& setValue == "def"
		)
	) {
		match.on_offence = "home";
		match.on_defence = "away";
	}
	else {
		match.on_offence = "away";
		match.on_defence = "home";
	}
}

//Getters

function getMatchContinuity(match) {
	//Function which determines if the match should continue.
	
	return (
		getMatchTotalTime(match) < 3600
		|| (
			(
				getMatchTotalTime(match) - 3600 < match.rules.overtime
				|| getOvertimeType(match.rules)
			)
			&& getTeamMatchGoals(match.teams.home.match_stats) == getTeamMatchGoals(match.teams.away.match_stats)
		)
	);
}

function matchGetTotalScore(match) {
	var teams = match.teams;
	
	var scores = [
		getTeamMatchGoals(teams.home.match_stats)
		,getTeamMatchGoals(teams.away.match_stats)
	];
	
	return scores;
}

function matchGetPeriodScores(match) {
	var teams = match.teams;
	var string = "(";
	
	var scores;
	//This value makes sure that there will be no duplicate commas.
	var periodRecorded = true;
	
	for (var i = 0; i < teams.home.match_stats.goals_per_period.length; i++) {
		if (periodRecorded && i > 0) {
			string += ", ";
		}
		
		scores = [
			teams.home.match_stats.goals_per_period[i]
			,teams.away.match_stats.goals_per_period[i]
		];
		
		if (i < 3 || scores[0] != 0 || scores[1] != 0) {
			//Only takes an overtime period if it has goals scored.
			periodRecorded = true;
			string += getScore(scores);
		}
		else {
			periodRecorded = false;
		}
	}
	
	string += ")";
	return string;
}

function getMatchEvents(match) {
	var byPeriod = [];
	var goal;
	
	for (var i = 0; i < match.teams.home.match_stats.goals_per_period.length; i++) {
		byPeriod.push("");
	}
	
	for (var i = 0; i < match.goals.length; i++) {
		goal = match.goals[i];
		byPeriod[goal.period - 1] += `
			<tr>
				<td>${secondsToTime(getMatchTotalTime(goal))}</td>
				<td>${match.teams[goal.team].abbreviation}</td>
				<td>${getScore(goal.scoreline)}</td>
				<td>${getScorerString(goal)}</td>
			</tr>
		`;
	}
	
	var html = "";
	
	for (var i = 0; i < byPeriod.length; i++) {
		html += `<tr><th class="matchBoxScorePeriod" colspan="4">${orderNumber(i + 1)} Period</th></tr>`;
		
		if (byPeriod[i].length == 0) {
			html += `<tr><td colspan="4" style="text-align: center;">No events</td></tr>`;
		}
		else {
			html += byPeriod[i];
		}
	}
	return html;
}

function getTeamMatchStats(match) {
	var html = `
		<table class="matchTeamStatTable">
			<tr>
				<th class="matchTeamStatsTeam matchHomeTeamName">${match.teams.home.fullname}</th>
				<th></th>
				<th class="matchTeamStatsTeam matchAwayTeamName">${match.teams.away.fullname}</th>
			</tr>
			<tr>
				<td class="matchTeamStat leftAlign">${getTeamMatchGoals(match.teams.home.match_stats)}</td>
				<th class="matchTeamStatCategory">Goals</th>
				<td class="matchTeamStat rightAlign">${getTeamMatchGoals(match.teams.away.match_stats)}</td>
			</tr>
			<tr>
				<td class="matchTeamStat leftAlign">${getTeamPuckPossessionPct(match, match.teams.home)}</td>
				<th class="matchTeamStatCategory">Puck Possession</th>
				<td class="matchTeamStat rightAlign">${getTeamPuckPossessionPct(match, match.teams.away)}</td>
			</tr>
			<tr>
				<td class="matchTeamStat leftAlign">${getTeamMatchShots(match.teams.home)}</td>
				<th class="matchTeamStatCategory">Shots</th>
				<td class="matchTeamStat rightAlign">${getTeamMatchShots(match.teams.away)}</td>
			</tr>
			<tr>
				<td class="matchTeamStat leftAlign">${getTeamMatchShotPct(match.teams.home)}</td>
				<th class="matchTeamStatCategory">Shot Percentage</th>
				<td class="matchTeamStat rightAlign">${getTeamMatchShotPct(match.teams.away)}</td>
			</tr>
		</table>
	`;
	
	return html;
}

function getFinalScoreString(match) {
	//Displays the final score of the match properly.
	
	string = getScore([getTeamMatchGoals(match.teams.home.match_stats), getTeamMatchGoals(match.teams.away.match_stats)]);
	
	if (match.period > 3) {
		string += " OT";
	}
	
	return string;
}