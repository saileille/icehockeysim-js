//Contains constants and things which are generally not modified.

//All sorts of set-up things.
function setUp() {
	setListWeights(BASE_POSITIONS, "frequency");
	setListWeights(RINK_POSITIONS, "defensive_value");
	setListWeights(RINK_POSITIONS, "offensive_value");
	
	/*
	var cultureContent = Object.keys(CULTURES);
	var culture;

	for (var i = 0; i < cultureContent.length; i++) {
		culture = CULTURES[cultureContent[i]];
		setWeights(culture.forenames, "weight");
		setWeights(culture.surnames, "weight");
	}
	
	setWeights(COUNTRIES, "icehockey_culture");
	
	for (var i = 0; i < COUNTRIES.object_array.length; i++) {
		setWeights(COUNTRIES.object_array[i].cultures, "weight");
	}
	*/
}

var BASE_POSITIONS = new ObjectList([
	new BasePosition("Goalkeeper", "GK", 2)
	,new BasePosition("Left Defender", "LD", 3)
	,new BasePosition("Right Defender", "RD", 3)
	,new BasePosition("Left Winger", "LW", 4)
	,new BasePosition("Right Winger", "RW", 4)
	,new BasePosition("Centre", "C", 4)
]);

/*
Determines how much player's offensive/defensive values take effect.
Goalkeeper is a special case. They only intervene when a shot comes.
*/
var RINK_POSITIONS = new ObjectList([
	//new RinkPosition("Goalkeeper", "GK", 100, true)
	new RinkPosition("Left Defender", "LD", 75)
	,new RinkPosition("Right Defender", "RD", 75)
	,new RinkPosition("Left Winger", "LW", 25)
	,new RinkPosition("Centre", "C", 50)
	,new RinkPosition("Right Winger", "RW", 25)
]);

const ATTR_RANGE = [1, 100];
const ADJUST_RANGE = [1, 2];

const BASE_SHOT_CHANCE = 28 / 1800;
const BASE_GOAL_CHANCE = 2.75 / (BASE_SHOT_CHANCE * 1800);

var matches = [];

/* Keeping this for reference.
var CULTURES = {
	"english": new Culture(
		"English"
		,new ObjectList([
			new Name("Brian", 2)
			,new Name("Fred", 1)
		])
		,new ObjectList([
			new Name("O'Neill", 2)
			,new Name("Hutchinson", 1)
		])
	)
};
*/

/* Keeping this for reference.
var COUNTRIES = new ObjectList([
	new Country(
		"Finland"
		,"FIN"
		,new ObjectList([
			new CultureInCountry(CULTURES.finnish, 10)
			,new CultureInCountry(CULTURES.english, 0)
		])
		,100
	)
]);
*/

setUp();