//Getters

function getScorerString(goal) {
	//Returns the goalscorer and assister names.
	var string = getPersonFullname(goal.scorer) + "<br>(";
	
	if (goal.assists.length == 0) {
		string += "-";
	}
	else {
		for (var i = 0; i < goal.assists.length; i++) {
			if (i > 0) {
				string += ", ";
			}
			string += getPersonShortname(goal.assists[i]);
		}
	}
	
	string += ")";
	return string;
}