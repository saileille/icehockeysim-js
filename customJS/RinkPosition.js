//RinkPosition class functions and getters

//Functions

function setPositionOffDef(position, type, value) {
	if (type == "off") {
		position.offensive_value = value;
		position.defensive_value = 100 - value;
	}
	else if (type == "def") {
		position.defensive_value = value;
		position.offensive_value = 100 - value;
	}
}