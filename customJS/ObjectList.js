//Functions

function setListWeights(objectlist, attributeName) {
	var weight = new WeightList();
	var value;
	
	for (i in objectlist.object_array) {
		value = objectlist.object_array[i][attributeName];
		weight.array.push(value);
		weight.total += value;
	}
	
	objectlist.weight[attributeName] = weight;
}