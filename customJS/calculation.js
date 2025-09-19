//All sorts of functions for calculating things.

function getMatchTotalTime(object) {
	//object must have period and time properties
	return (object.period - 1) * 1200 + object.time;
}

function getShooterIndexes(match) {
	//Returns the indexes of potential goalscorer and assisters.
	var activeLine = match.teams[match.on_offence].active_line;
	
	var line = copyLine(activeLine.positions, activeLine.opponent_number, activeLine.order_number);
	
	var potentialScorers = [];
	var index;
	var weight = line.positions.weight;
	
	do {
		index = weightedListRandom(weight.offensive_value.array, weight.offensive_value.total);
		
		weight.offensive_value.total -= weight.offensive_value.array[index];
		line.positions.object_array.splice(index, 1);
		weight.offensive_value.array.splice(index, 1);
		
		potentialScorers.push(index);
		
		if (Math.random() < 0.25) {
			//Not all goals have a scorer + two assisters.
			break;
		}
	}
	while (potentialScorers.length < 3);
	
	correctIndexes(potentialScorers);
	return potentialScorers;
}

function getShooterSkills(shooters) {
	//Determines how good the shooters shooting are offensively.
	
	var totalWeight = 0;
	var totalOffence = 0;
	var weight;
	
	for (var i = 0; i < shooters.length; i++) {
		weight = 2 ** (shooters.length - 1 - i);
		totalOffence += shooters[i].adjusted_off_skill * weight;
		totalWeight += weight;
	}
	
	totalOffence /= totalWeight;
	return totalOffence;
}