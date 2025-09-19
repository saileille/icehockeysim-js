function getGoalAttempters(match) {
	var indexes = getShooterIndexes(match);
	var activeLine = match.teams[match.on_offence].active_line.positions.object_array;
	
	var potentialScorers = [];
	
	for (var i = 0; i < indexes.length; i++) {
		potentialScorers.push(activeLine[indexes[i]].player);
	}
	
	return potentialScorers;
}