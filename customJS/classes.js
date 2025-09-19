//All application classes are here.

class Person {
	constructor(
		id = 0
		,forename = ""
		,surname = ""
		,age = 0
		,nationalities = []	//Array of Country objects
		,cultures = []	//Array of Culture objects
	) {
		this.id = id;
		this.forename = forename;
		this.surname = surname;
		this.age = age;
		this.nationalities = nationalities;
		this.cultures = cultures	//Used for names.
	}
}

class Player extends Person {
	constructor(
		//Super
		id
		,forename
		,surname
		,age
		,nationalities
		,cultures
		//Sub
		,off = 0.0	//Goalkeepers do not have this.
		,def = 0.0
		,adjust_off = 0.0
		,adjust_def = 0.0
		,positions = []	//List of Position objects
		
		//match-specific
		,match_stats = null	//PlayerMatchStats object
	) {
		super(
			id
			,forename
			,surname
			,age
			,nationalities
			,cultures
		);
		
		this.offensive_skill = off;
		this.defensive_skill = def;
		this.adjusted_off_skill = adjust_off;
		this.adjusted_def_skill = adjust_def;
		this.positions = positions;
		this.match_stats = match_stats;
	}
}

class Position {
	constructor(
		name = ""
		,abbreviation = ""
	) {
		this.name = name;
		this.abbreviation = abbreviation;
	}
}

class BasePosition extends Position {
	//Used in player generation.
	constructor(
		//Super
		name
		,abbreviation
		//Sub
		,frequency = 0.0
	) {
		super(name, abbreviation);
		this.frequency = frequency;
	}
}

class PlayerPosition extends Position {
	//Used to determine Player position proficiencies.
	constructor(
		//Super
		name
		,abbreviation
		//Sub
		,proficiency = 0.0
	) {
		super(name, abbreviation);
		this.proficiency = proficiency;
	}
}

class RinkPosition extends Position {
	//Used in match simulation. The object contains one player.
	constructor(
		//Super
		name
		,abbreviation
		//Sub
		,defensive_value = 0.0
		,special = false
		,player = null	//Player object
	) {
		super(name, abbreviation);
		this.defensive_value = defensive_value;
		this.offensive_value = 100 - defensive_value;
		this.special = special;
		this.player = player;
	}
}

class Match {
	constructor(
		teams = {
			//Object of Team objects
			"home": null
			,"away": null
		}
		,competition = null	//Competition object
		,id = -1
		,time = 1200
		,period = 0
		,rules = new MatchRules()	//MatchRules object
		,lineup = {}
		,goals = []	//Array of Goal objects
		,penalties = []	//Array of Penalty objects
		,player_stats = []	//Array of Player stat objects
		,on_offence = ""
		,on_defence = ""
	) {
		this.teams = teams;
		this.competition = competition;
		this.id = id;
		this.time = time;
		this.period = period;
		this.rules = rules;
		this.lineup = lineup;	//Starting line-up of both teams.
		this.goals = goals;
		this.penalties = penalties;
		this.player_stats = player_stats;
		this.on_offence = on_offence;	//Either "home" or "away".
		this.on_defence = on_defence;	//Either "home" or "away".
	}
}

class MatchRules {
	constructor(
		overtime = -1
	) {
		this.overtime = overtime;	//Overtime length in seconds. -1 = infinite overtime; 0 = no overtime
	}
}

class Goal {
	constructor(
		time = 0
		,period = 1
		,team = ""	//String; either home or away
		,scorer = null	//Player object
		,assists = []	//Array of Player objects
		,offence_line = []	//Array of RinkPosition objects
		,defence_line = []	//Array of RinkPosition objects
		,goalkeeper = null	//Player object; the goalkeeper who conceded.
		,special = ""
		,scoreline = []	//Home and away scores at the time of scoring.
	) {
		this.time = time;
		this.period = period;
		this.team = team;
		this.scorer = scorer;
		this.assists = assists;
		this.offence_line = offence_line;
		this.defence_line = defence_line;
		this.goalkeeper = goalkeeper;
		this.special = special;	//Whether there was PP/PK/EN involved.
		this.scoreline = scoreline;
	}
}

class Penalty {
	constructor(
		time = 0
		,duration = 120
		,team = null	//Team object
		,player = null	//Player object
		,one_goal = true
		,expired = false
	) {
		this.time = time;
		this.duration = duration;
		this.team = team;
		this.player = player;
		this.one_goal = one_goal;	//Whether the penalty ends when a goal gets scored.
		this.expired = expired;	//Determines if the penalty is still active.
	}
}

class TeamMatchStats {
	constructor(
		goals_per_period = []
		,time_on_puck = 0
	) {
		this.goals_per_period = goals_per_period;
		this.time_on_puck = time_on_puck;
	}
}

class PlayerMatchStats {
	constructor(
		goals = 0
		,assists = 0
		,plus_minus = 0	//Skater stat
		,shots = 0
		,saves = 0	//Goalie stat
		,conceded = 0	//Goalie stat
		,time_on_ice = 0
	) {
		this.goals = goals;
		this.assists = assists;
		this.plus_minus = plus_minus;
		this.shots = shots;
		this.saves = saves;
		this.conceded = conceded;
		this.time_on_ice = time_on_ice;
	}
}

class Competition {
	constructor(
		fullname = ""
		,teams = []	//Team objects
		,colours = [
			"CCFFFF"
			,"CCCCCC"
		]
	) {
		this.fullname = fullname;
		this.teams = teams;
		this.colours = colours;	//[0] = primary colour, [1] = secondary, etc.
	}
}

class Team {
	constructor(
		fullname = ""
		,abbreviation = ""
		,colours = {
			"general": [
				"000000"
				,"ffffff"
			]
			,"home": [
				"000000"
				,"ffffff"
			]
			,"away": [
				"ffffff"
				,"000000"
			]
		}
		,arena = null
		,players = []	//Array of Player objects
		,stature = 0
		,lines = []	//Array of Line objects
		,goalkeepers = []	//Array of Player objects (stores starter and backup goalies)
		,separated_players = {}
		,active_line = null	//Line object
		,match_stats = null	//TeamMatchStats object
	) {
		this.fullname = fullname;
		this.abbreviation = abbreviation;
		this.colours = colours;
		this.arena = arena;
		this.players = players;
		this.stature = stature;	//Determines how good the team is and how good players it can attract.
		this.lines = lines;
		this.goalkeepers = goalkeepers;
		this.separated_players = separated_players;	//An object which has skaters and goalies in separate properties.
		
		//Match-specific
		this.active_line = active_line;
		this.match_stats = match_stats;
	}
}

class Line {
	constructor(
		positions = new ObjectList()	//ObjectList of RinkPosition objects
		,order_number = 0
		,opponent_number = 5
	) {
		this.positions = positions;
		this.order_number = order_number;	//First line would have 1, etc. Special units will have their separate numbering.
		this.opponent_number = opponent_number;	//By comparing this number and the amount of properties, we can determine if the line is even strength, powerplay or penalty-killing unit.
	}
}

class Country {
	constructor(
		name = ""
		,abbreviation = ""
		,cultures = new ObjectList()	//ObjectList of Culture objects
		,icehockey_culture = 0	//The likelyhood of a generated player to be from this country.
	) {
		this.name = name;
		this.abbreviation = abbreviation;
		this.cultures = cultures;
		this.icehockey_culture = icehockey_culture;
	}
}

class Culture {
	//Language, mostly.
	constructor(
		name = ""
		,forenames = new ObjectList()	//ObjectList of Name objects
		,surnames = new ObjectList()	//ObjectList of Name objects
	) {
		this.name = name;
		this.forenames = forenames;
		this.surnames = surnames;
	}
}

class ObjectList {
	//Used to get the weight and weight array more easily.
	
	constructor(
		object_array = []
		,weight = {}	//Object of Weight objects
	) {
		this.object_array = object_array;	//Array of objects
		this.weight = weight;	//Properties sync with object_array's properties.
	}
}

class ObjectDict {
	constructor(
		object_dict = {}
		,weight = {}
	) {
		this.object_dict = object_dict;	//Dictionary of objects
		this.weight = weight	//Object of Weight objects
	}
}

class WeightList {
	//Used in ObjectList
	//Vital for performance-efficient weighted randomness.
	
	constructor(
		array = []
		,total = 0
	) {
		this.array = array;
		this.total = total;
	}
}

class WeightDict {
	constructor(
		dict = {}
		,total = 0
	) {
		this.dict = dict;
		this.total = total;
	}
}

class CultureInCountry {
	constructor(
		culture = null	//Culture object
		,weight = 0
	) {
		this.culture = culture;
		this.weight = weight;	//How populous the culture is in that country.
	}
}

class Name {
	constructor(
		name = ""
		,weight = 0
		,male = true
	) {
		this.name = name;
		this.weight = weight;	//How popular the name is in that culture
		this.male = male;
	}
}