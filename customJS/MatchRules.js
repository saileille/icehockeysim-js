//Getters

function getOvertimeType(matchRules) {
	//Determines if the overtime is continuous or not.
	
	if (matchRules.overtime == -1) {
		return true;
	}
	else {
		return false;
	}
}