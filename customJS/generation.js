//Functions generating objects and other under-the-hood things.

function createPlayer(positionName=null, averageSkill=0) {
	//averageSkill is the actual skill for now. Will be changed eventually.
	
	if (averageSkill == 0) {
		//Randomising the skill.
		averageSkill = randomFloat(ATTR_RANGE[0], ATTR_RANGE[1]);
	}
	
	var player = new Player();
	
	generateNationality(player);
	generateCulture(player, nationalityIndex=0);
	generateName(player, cultureIndex=0);
	generatePositions(player);
	generateFirstPosition(player, positionName);
	
	player.defensive_skill = averageSkill;
	player.adjust_def_skill = adjustRange(player.defensive_skill, ATTR_RANGE, ADJUST_RANGE);
	
	if (player.positions[0].abbreviation != "GK") {
		//All but goalkeepers.
		player.offensive_skill = averageSkill;
		player.adjust_off_skill = adjustRange(player.offensive_skill, ATTR_RANGE, ADJUST_RANGE);
	}
	
	return player;
}

function generateTeam(team) {
	//A simple template team.
	fillTeam(team);
	separatePlayers(team);
	getLines(team);
	
	return team;
}

function generateLeague() {
	
}

function generateMatchTeams() {
	//Makes two teams to get an example match set.
	var teams = [
		new Team("Home", "HOM")
		,new Team("Away", "AWA")
	];
	
	//teams[0].stature = 2;
	//teams[1].stature = 1;
	
	for (var i = 0; i < teams.length; i++) {
		teams[i].stature = 50;
		generateTeam(teams[i]);
	}
	
	return teams;
}

function copyLine(origin=RINK_POSITIONS, opponentCount=5, orderNr=0) {
	//Creates a copy of a Line object.
	//origin is what gets copied.
	var newLine = new Line(opponent_number=opponentCount, order_number = orderNr);
	newLine.positions = new ObjectList();
	
	newLine.positions.weight.offensive_value = new WeightList();
	newLine.positions.weight.defensive_value = new WeightList();
	
	for (var i = 0; i < origin.object_array.length; i++) {
		newLine.positions.object_array.push(copy(origin.object_array[i]));
		newLine.positions.weight.offensive_value.array.push(origin.weight.offensive_value.array[i]);
		newLine.positions.weight.defensive_value.array.push(origin.weight.defensive_value.array[i]);
	}
	
	newLine.positions.weight.offensive_value.total = origin.weight.offensive_value.total;
	newLine.positions.weight.defensive_value.total = origin.weight.defensive_value.total;
	
	return newLine;
}

function getScore(scoreList) {
	//First number is home score, second number is away score.
	return scoreList[0] + "&nbsp;-&nbsp;" + scoreList[1];
}