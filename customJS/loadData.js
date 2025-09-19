//Takes JSON'd database files when starting a new game (or loading a save), and formats them appropriately for a game.

function initialiseSessionStorage() {
	//SETTING EVERYTHING TO SESSION STORAGE (so I can get them out of the JSON functions...)
	
	$.getJSON("db/comps.json", function(data) {
		console.log("comps.json");
		sessionStorage.setItem("comps", JSON.stringify(data));
	});
	
	$.getJSON("db/countries.json", function(data) {
		console.log("countries.json");
		sessionStorage.setItem("countries", JSON.stringify(data));
	});
	
	$.getJSON("db/cultures.json", function(data) {
		console.log("cultures.json");
		sessionStorage.setItem("cultures", JSON.stringify(data));
	});
	
	$.getJSON("db/players.json", function(data) {
		console.log("players.json");
		sessionStorage.setItem("players", JSON.stringify(data));
	});
	
	$.getJSON("db/teams.json", function(data) {
		console.log("teams.json");
		sessionStorage.setItem("teams", JSON.stringify(data));
	});
}

function loadJSON() {
	//Execute this only when you start a new game.
	
	var comps = JSON.parse(sessionStorage.getItem("comps"));
	var countries = JSON.parse(sessionStorage.getItem("countries"));
	var cultures = JSON.parse(sessionStorage.getItem("cultures"));
	var players = JSON.parse(sessionStorage.getItem("players"));
	var teams = JSON.parse(sessionStorage.getItem("teams"));
	
	sessionStorage.clear();
	
	console.log(comps);
	console.log(countries);
	console.log(cultures);
	console.log(players);
	console.log(teams);
	//RE-FORMATTING
	
	comps = arrayToDict(comps);
	comps = convToArrayDict(comps);
	
	countries = new ObjectDict(arrayToDict(countries));
	setDictWeights(countries, "icehockey_culture");
	arrangeCountryCultures(countries.object_dict);
	
	cultures = arrayToDict(cultures);
	arrangeCultureNames(cultures);
	
	players = arrayToDict(players);
	players = convToArrayDict(players);
	
	teams = arrayToDict(teams);
	teams = convToArrayDict(teams);
	
	
	//COMPLETING DATA
	
	getCompetitionTeams(comps, teams);
	getTeamCompetitions(teams, comps);
	
	//document.write(JSON.stringify(comps));
	//document.write(JSON.stringify(countries));
	//document.write(JSON.stringify(cultures));
	//document.write(JSON.stringify(players));
	//document.write(JSON.stringify(teams));
	
	//console.log(countries.object_dict.id1.cultures);
	
	//SAVING TO LOCAL STORAGE
	
	var gameData = {
		"comps": comps
		,"countries": countries
		,"cultures": cultures
		,"players": players
		,"teams": teams
	};
	
	//document.write(JSON.stringify(gameData));
	
	var gameName = "game";
	
	sessionStorage.setItem("currentGame", gameName);
	localStorage.setItem(gameName, JSON.stringify(gameData));
	
	//document.write(localStorage.getItem(gameName));
	//console.log(JSON.parse(localStorage.getItem(gameName)));
	/*
	*/
}

function getSaveData() {
	var gameName = sessionStorage.getItem("currentGame");
	var gameData = JSON.parse(localStorage.getItem(gameName));
	
	//console.log(gameData);
	
	return gameData;
}

function arrangeCountryCultures(countries) {
	var country;
	var cultureId;
	
	for (id in countries) {
		country = countries[id];
		
		//Sets up the country cultures, also does weighing.
		country.cultures = new ObjectList(country.cultures);
		setListWeights(country.cultures, "frequency");
		//console.log(country.cultures);
	}
}

function getCompetitionTeams(comps, teams) {
	//Completes the lists of teams in competitions.
	var comp;
	var team;
	
	for (compId in comps.items) {
		comp = comps.items[compId];
		
		for (teamId in teams.items) {
			team = teams.items[teamId];
			if (
				team.competition === comp.id
				&& comp.teams.indexOf(team.id) === -1
			) {
				comp.teams.push(team.id);
				break;
			}
		}
	}
}

function getTeamCompetitions(teams, comps) {
	//Completes the team competition attributes.
	var team;
	var comp;
	
	for (teamId in teams.items) {
		team = teams.items[teamId];
		
		for (compId in comps.items) {
			comp = comps.items[compId];
			
			if (
				team.competition === undefined
				&& comp.teams.indexOf(team.id) !== -1
			) {
				team.competition = comp.id;
				break;
			}
		}
	}
}

function arrangeCultureNames(cultures) {
	var culture;
	
	for (cultureId in cultures) {
		culture = cultures[cultureId];
		
		culture.forenames = new ObjectList(culture.forenames);
		culture.surnames = new ObjectList(culture.surnames);
		
		setListWeights(culture.forenames, "popularity");
		setListWeights(culture.surnames, "popularity");
	}
}

function arrayToDict(array) {
	var dictionary = {};
	var id;
	
	for (i in array) {
		id = "id" + array[i].id;
		dictionary[id] = array[i];
	}
	
	return dictionary;
}

function convToArrayDict(dictionary) {
	//"ArrayDict" meaning a dictionary with the information on the next ID to use.
	var dictLength = Object.keys(dictionary).length;
	
	var newDict = {
		"items": dictionary
		,"nextId": dictLength + 1
	};
	
	return newDict;
}

initialiseSessionStorage();