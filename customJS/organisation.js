//I suppose, this file should contain functions which help organising stuff... I am trying really hard to make these comments descriptive, okay!?

function orderPlayers(playerObject) {
	//Sorts the players according to their ability.
	//A primitive way for determining lines.
	
	playerObject.goalies.sort(dynamicSort("-defensive_skill"));
	playerObject.skaters.sort(
		function(a, b) {
			return getPlayerTotalAbility(b) - getPlayerTotalAbility(a)
		}
	);
	
	return playerObject;
}