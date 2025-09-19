//Getters

function getLineStrength(line, type) {
	//How good the line is either offensively or defensively.
	//type is either "offensive" or "defensive"
	
	var players = line.positions.object_array;
	
	var attribute = "adjust_" + type + "_skill";
	var factor = type + "ensive_value";
		
	var value = 0;
	var position;
	
	for (var i = 0; i < players.length; i++) {
		position = players[i];
		value += (position.player[attribute] * position[factor]);
	}
	
	return value;
}

function getLineTotalStrength(line) {
	return getLineStrength(line, "off") + getLineStrength(line, "def");
}

function getLineString(line) {
	//Returns a representation of the line in HTML.
	
	//positions[i].player is player object.
	var positions = line.positions.object_array;
	
	var posDict = {};
	var posName;
	
	for (var i = 0; i < positions.length; i++) {
		posName = positions[i].abbreviation;
		posDict[posName] = positions[i].player;
	}
	
	var html = `
		<table class="matchLineUpTable">
			<tr>
				<th class="matchLineUpNewLine" colspan="3">Line ${line.order_number}</th>
			</tr>
		</table><table class="matchLineUpTable">
			<tr>
				<td class="matchLineUp3Wide">${getPersonShortname(posDict.LW)}</td>
				<td class="matchLineUp3Wide">${getPersonShortname(posDict.C)}</td>
				<td class="matchLineUp3Wide">${getPersonShortname(posDict.RW)}</td>
			</tr>
		</table><table class="matchLineUpTable">
			<tr>
				<td class="matchLineUp2Wide">${getPersonShortname(posDict.LD)}</td>
				<td class="matchLineUp2Wide">${getPersonShortname(posDict.RD)}</td>
			</tr>
		</table>
	`;
	
	return html;
}