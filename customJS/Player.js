//Player class functions and getters

//Functions

function generatePositions(player) {
	//Resets Player positions.
	
	//Let's empty the Player positions array.
	player.positions = [];
	
	var positions = BASE_POSITIONS.object_array;
	
	for (var i = 0; i < positions.length; i++) {
		player.positions.push(new PlayerPosition(positions[i].name, positions[i].abbreviation));
	}
}

function generateFirstPosition(player, positionName=null) {
	//Determining the position of the player.
	
	if (positionName != null) {
		//The primary position has been given as a parametre.
		for (var i = 0; i < player.positions.length; i++) {
			if (player.positions[i].abbreviation == positionName) {
				player.positions[i].proficiency = 100.0;
				break;
			}
		}
	}
	
	else {
		var index = weightedListRandom(BASE_POSITIONS.weight.frequency.array, BASE_POSITIONS.weight.frequency.total);
		player.positions[index].proficiency = 100.0;
	}
	
	sortPositions(player);
}

function sortPositions(player) {
	player.positions.sort(dynamicSort("-proficiency"));
}

//Getters

function getPlayerPosition(player) {
	//Generates a string of playable positions for display purposes.
	//Presumes the positions have been ordered coherently.
	
	var string = "";
	
	for (var i = 0; i < player.positions.length && player.positions[i].proficiency > 75; i++) {
		if (i > 0) {
			string += "/";
		}
		
		string += player.positions[i].abbreviation;
	}
	
	return string;
}

function getPlayerTotalAbility(player) {
	//Used for primitive sorting for betterment.
	return player.adjust_off_skill + player.adjust_def_skill;
}