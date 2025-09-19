//Number functions
function randomInt(value1, value2) {
	var min;
	var max;
	
	if (value1 < value2) {
		min = value1;
		max = value2;
	}
	else {
		min = value2;
		max = value1;
	}
	
	var randInt = min + (Math.floor(Math.random() * ((max - min) + 1)));
	
	return randInt;
}

function randomFloat(min, max) {
	let randFloat = min + (Math.random() * (max - min));
	return randFloat;
}

function randomIntKindOfGaussian(min,max) {
	var random = min;
	for (var i = 0; i < (max - min); i++) {
		random += randomInt(0,1);
	}
	return random;
}

function randomFloatKindOfGaussian(min,max,precision) {
	var random = min;
	for (var i = 0; i < (max - min); i += (1 / precision)) {
		random += Math.random() / precision;
	}
	return random;
}

function separator(num,symbol,decimal,gap) {
	/*
	Argument "num" is the given number.
	Argument "symbol" is the thousand separator character used.
	Argument "decimal" is the decimal separator character used.
	Argument "gap" is how many numbers before a separator (3 with normal numbers).
	*/
	var numStr = String(num);
	if (numStr.length < 3) {
		return numStr;
	}
	var is_negative = false;
	if (numStr[0] == "-") {	//Negativity check.
		is_negative = true;
		numStr = numStr.substring(1,numStr.length);
	}
	var is_float = false;
	for (var i = 0; i < numStr.length - 1; i++) {	//Checks if the number is a float.
		if (numStr[i] == ".") {
			is_float = true;
			var decimals = numStr.substring(i + 1,numStr.length);
			numStr = numStr.substring(0,i);
			break;
		}
	}
	var numArr = [];
	for (var i = 0; i < numStr.length; i++) {
		if (i != 0 && i % gap == 0) {
			numArr.splice(0,0,symbol);
		}
		numArr.splice(0,0,numStr[numStr.length - 1 - i]);	//Compiles the number from back to front.
	}
	numStr = "";
	for (var i = 0; i < numArr.length; i++) {
		numStr += numArr[i];
	}
	if (is_negative == true) {
		numStr = "-" + numStr;
	}
	if (is_float == true) {
		numStr += decimal + decimals;
	}
	return numStr;
}

//Array functions
function arraySum(array) {
	var sum = 0;
	for (var i = 0; i < array.length; i++) {
		sum += array[i]; 
	}
	return sum;
}

function arrayAvg(array) {
	var sum = arraySum(array);
	var avg = sum / array.length;
	return avg;
}

function copyWithIndexCount(array,start,count) {	//Use array,0,array.length to get whole array.
	var copied = [];
	for (var i = start; i < start + count; i++) {
		if (i >= array.length) {
			break;
		}
		copied.push(array[i]);
	}
	return copied;
}

function copyWithIndexNumber(array,start,number) {	//Use array,0,array.length to get whole array.
	var copied = [];
	for (var i = start; i < number; i++) {
		if (i >= array.length) {
			break;
		}
		copied.push(array[i]);
	}
	return copied;
}

function randomOrder(array) {
	var rArray = [];
	var rIndex;
	
	while (array.length > 0) {
		rIndex = randomInt(0, array.length - 1);
		rArray.push(array[rIndex]);
		array.splice(rIndex, 1);
	}
	
	return rArray;
}

function weightedListRandom(array, totalWeight=0) {
	//Array contains the weighted numbers. Function returns the selected index.
	
	if (totalWeight === 0) {
		for (i in array) {
			totalWeight += array[i];
		}
	}
	
	var selected = randomFloat(0, totalWeight);
	
	//Tracks progress of the iteration.
	var progress = 0;
	var index = -1;
	
	for (var i = 0; i < array.length && index === -1; i++) {
		progress += array[i];
		
		if (selected < progress) {
			index = i;
		}
	}
	
	return index;
}

function weightedDictRandom(dict, totalWeight=0) {
	
	//If totalWeight has not been given.
	if (totalWeight === 0) {
		for (key in dict) {
			totalWeight += dict[key];
		}
	}
	
	var selected = randomFloat(0, totalWeight);
	
	//Tracks progress of the iteration.
	var progress = 0;
	var selectedKey = "";
	
	for (key in dict) {
		progress += dict[key];
		
		if (selected < progress) {
			selectedKey = key;
			break;
		}
	}
	
	return selectedKey;
}

function altRandomBinaryOutcome(modifiers, base=0.5, posOutcome=true, negOutcome=false) {
	//Can be used for things like determining if a goal gets scored, who has the puck, etc.
	
	//base = base likelihood
	//modifiers = array with length of two. First value is positive modifier, the second is negative modifier.
	
	//Inverting the base, because I could not figure out anything else.
	base = 1 - base;
	
	//Saving which one is the positive modifier.
	var positive = modifiers[0];
	
	modifiers.sort(function(a,b){return b>a});
	
	//If the modifier positions have changed, we must take that into account.
	var invert;
	
	if (positive == modifiers[0]) {
		invert = 1;
	}
	else {
		invert = -1;
	}
	
	var random = Math.random();
	var weight = modifiers[0] / modifiers[1];
	var outcome;
	
	var endResult = random * weight;
	var check = (endResult - base) * invert;
	
	/*
	
	0 = (x * weight - base) * invert
	0 = (x-weight - base) * invert
	0 = x-weight-invert - base-invert
	x-weight-invert = base-invert
	x-weight = base
	x = base / weight
	
	x is the random threshold between positive and negative result
	
	*/
	
	console.log(
		"\nfinal modifier: " + weight	//Also the upper limit of endResult
		+ "\nend result: " + endResult
		+ "\nfinal check: " + check
		+ "\nrandom threshold: " + (base / weight)
		+ "\nrandom seed: " + random
	);
	
	if (check > 0) {
		outcome = posOutcome;
	}
	else {
		outcome = negOutcome;
	}
		
	/*
	if (endResult < base) {
		outcome = posOutcome;
	}
	else {
		outcome = negOutcome;
	}
	*/
	
	return outcome;
}

function randomBinaryOutcome(modifiers, base=0.5, posOutcome=true, negOutcome=false) {
	//Can be used for things like determining if a goal gets scored, who has the puck, etc.
	
	//base = base likelihood
	//modifiers = array with length of two. First value is positive modifier, the second is negative modifier.
	
	//Saving which one is the positive modifier.
	var positive = modifiers[0];
	
	modifiers.sort(function(a,b){return b>a});
	
	//If the modifier positions have changed, we must take that into account.
	var invert;
	if (positive == modifiers[0]) {
		invert = 1;
		base = 1 - base;
	}
	else {
		invert = -1;
	}
	
	var random = Math.random();
	var weight = modifiers[0] / arraySum(modifiers) * 2;
	var endResult = random * weight;
	
	//base - endResult: the larger the weight, the smaller the result; the smaller the base, the smaller the result
	
	//endResult - base: the larger the weight, the larger the result; the smaller the base, the larger the result
	
	//1 - base - endResult: the smaller the base, the larger the result; the larger the weight, the smaller the result
	
	var check = (base - endResult) * invert;
	
	/*
	
	0 = (x * weight - base) * invert
	0 = (x-weight - base) * invert
	0 = x-weight-invert - base-invert
	x-weight-invert = base-invert
	x-weight = base
	x = base / weight
	
	x is the random threshold between positive and negative result
	
	*/
	
	/*console.log(
		"\nend result: " + endResult
		+ "\nbase: " + base
		+ "\nfinal check: " + check
		//+ "\nrandom threshold: " + (base / weight)
		+ "\nrandom seed: " + random
	);*/
	
	var outcome;
	
	if (check < 0) {
		outcome = posOutcome;
	}
	else {
		outcome = negOutcome;
	}
		
	/*
	if (endResult < base) {
		outcome = posOutcome;
	}
	else {
		outcome = negOutcome;
	}
	*/
	
	return outcome;
}


function correctIndexes(array) {
	//Corrects index numbers, presuming that the number of items has constantly been diminishing.
	
	for (var i = array.length - 1; i > 0; i--) {
		for (var i2 = i - 1; i2 >= 0; i2--) {
			if (array[i] >= array[i2]) {
				array[i]++;
			}
		}
	}
}

//Stolen from https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
function dynamicSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

function copy(object) {
	//Requires jQuery.
	return $.extend(true, {}, object);
}

function secondsToTime(time) {
	//Converts plain seconds to minutes and seconds.
	
	var mins = Math.floor(time / 60);
	var secs = (time % 60).toFixed(0);
	
	if (secs.length == 1) {
		secs = "0" + secs;
	}
	
	return mins + ":" + secs;
}

function orderNumber(number) {
	//1 -> 1st, 2 -> 2nd and so on
	
	var numberStr = String(number);
	var end = numberStr.length;
	var suffix = "th";
	var last = numberStr[end-1];
	var secondToLast = numberStr[end-2];
	
	var exceptionSuffixes = {
		"1": "st"
		,"2": "nd"
		,"3": "rd"
	};
	
	if (last >= 1 && last <= 3) {
		if (end > 1) {
			if (secondToLast != "1") {
				suffix = exceptionSuffixes[last];
			}
		}
		else {
			suffix = exceptionSuffixes[last];
		}
	}
	
	return numberStr + suffix;
}

function convertToPct(value) {
	var percentage;
	
	if (value == value * 1) {
		percentage = (value * 100).toFixed(2) + " %";
	}
	else {
		percentage = "-";
	}
	return percentage;
}

function adjustRange(value, origRange, adjustedRange) {
	
	//Let's pretend the origRange starts from 0.
	var origRangeGap = origRange[1] - origRange[0];
	var adjustedRangeGap = adjustedRange[1] - adjustedRange[0];
	var valueFromNil = value - origRange[0];
	
	var valuePctFromMax = valueFromNil / origRangeGap;
	
	var adjustedValueFromNil = valuePctFromMax * adjustedRangeGap;
	
	var adjustedValue = adjustedValueFromNil + adjustedRange[0];
	
	return adjustedValue;
}

function randomColour() {
	var rgb = [];
	
	for (var i = 0; i < 3; i++) {
		rgb.push(randomInt(0, 255));
	}
	
	return convertToHexColour(rgb);
}

function convertToHexColour(rgbArray) {
	var hex = "";
	
	var hexPiece;
	for (var i = 0; i < rgbArray.length; i++) {
		hexPiece = rgbArray[i].toString(16);
		hex += String(("00" + hexPiece).slice(-2));
	}
	
	return hex;
}

function permute(permutation) {
	
	//Copies permutation array.
	var result = [permutation.slice()];
	
	//Array of 0s.
	var c = new Array(permutation.length).fill(0);
	
	var i = 1;
	var k;
	var p;
	while (i < permutation.length) {
		if (c[i] < i) {
			k = i % 2 && c[i];
			//console.log((i % 2) + "&&" + c[i]);
			//console.log(k);
			p = permutation[i];
			permutation[i] = permutation[k];
			permutation[k] = p;
			c[i]++;
			i = 1;
			
			//slice() copies the array
			result.push(permutation.slice());
		}
		else {
			c[i] = 0;
			i++;
		}
	}
	
	return result;
}

function permuteOwn(originalArray, desiredLength=null, combinations=[]) {
	class Permutation {
		constructor(combination, iCombination) {
			this.combination = combination;
			this.iCombination = iCombination;
		}
	}
	
	if (desiredLength === null || desiredLength > originalArray.length || desiredLength < 1) {
		desiredLength = originalArray.length;
	}
	
	var combinationCount = 1;
	for (var i = desiredLength; i > 1; i--) {
		combinationCount *= i;
	}
	
	if (combinations.length < combinationCount) {
		for (var i = combinations.length; i < combinationCount; i++) {
			combinations.push()
		}
	}
	
	for (i in originalArray) {
		
	}
	
	return combinations;
}

function divmod(value, division) {
	//For example, (200, 60) would return {3, 20}
	//(Like 200 seconds to 3 minutes and 20 seconds)
	
	var values = {
		"bigger": parseInt(value / division)
		,"smaller": value % division
	};
	
	return values;
}

function randomItem(array, remove=true) {
	//Takes a random item from an array, and deletes it from the array if necessary.
	var rIndex = randomInt(0, array.length - 1);
	var item = array[rIndex];
	
	if (remove === true) {
		array.splice(rIndex, 1);
	}
	
	return item;
}




