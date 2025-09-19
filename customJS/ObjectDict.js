//Functions

function setDictWeights(objectdict, attributeName) {
	var weight = new WeightDict();
	var value;
	
	for (key in objectdict.object_dict) {
		value = objectdict.object_dict[key][attributeName];
		weight.dict[key] = value;
		weight.total += value;
	}
	
	objectdict.weight[attributeName] = weight;
}