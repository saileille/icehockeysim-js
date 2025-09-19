//Functions

function getTeamPuckPossessionPct(match, team) {
	return convertToPct(team.match_stats.time_on_puck / getMatchTotalTime(match));
}

//Getters

function getTeamMatchGoals(stats) {
	return arraySum(stats.goals_per_period);
}