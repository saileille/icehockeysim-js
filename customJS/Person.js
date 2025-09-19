//Person class functions and getters.

//Functions

function generateNationality(person) {
	var countries = getSaveData().countries;
	//console.log(countries);
	var key = weightedDictRandom(countries.weight.icehockey_culture.dict, countries.weight.icehockey_culture.total);
	//console.log(key);
	person.nationalities.push(countries.object_dict[key]);
	//console.log(person.nationalities);
}

function generateCulture(person, nationalityIndex) {
	//nationalityIndex determines which of the person's nationalities generates the culture.
	
	//console.log(person);
	
	var cultures = person.nationalities[nationalityIndex].cultures;
	var index = weightedListRandom(cultures.weight.frequency.array, cultures.weight.frequency.total);
	person.cultures.push(cultures.object_array[index]);
	//console.log(culture);
	//console.log(person.cultures);
}

function generateName(person, cultureIndex) {
	//cultureIndex determines which of the person's cultures generates the name.
	
	var cultureId = "id" + person.cultures[cultureIndex].culture;
	
	//Taking the culture stuff.
	var culture = getSaveData().cultures[cultureId];
	
	var index = weightedListRandom(culture.forenames.weight.popularity.array, culture.forenames.weight.popularity.total);
	person.forename = culture.forenames.object_array[index].name;
	
	index = weightedListRandom(culture.surnames.weight.popularity.array, culture.surnames.weight.popularity.total);
	person.surname = culture.surnames.object_array[index].name;
}

//Getters
function getPersonFullname(person) {
	return person.forename + " " + person.surname;
}

function getPersonShortname(person) {
	return person.forename[0] + ". " + person.surname;
}

function getPersonNationality(person) {
	//Gives a string of nationalities for display purposes.
	
	var string = "";
	
	for (var i = 0; i < person.nationalities.length; i++) {
		if (i > 0) {
			string += "/";
		}
		string += person.nationalities[i].abbreviation;
	}
	
	return string;
}