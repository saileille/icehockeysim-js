function iterateSchedules(scheduleList) {
	//This function takes an array of schedules, iterates over them, and returns a match list based on it.
	
	var matchList = []
	for (var i in scheduleList) {
		matchList = matchList.concat(getMatches(scheduleList[i]));
	}
	
	matchList.sort(function(a, b) {
		if (a.home !== b.home) {
			if (a.home < b.home) {
				return -1;
			}
			else {
				return 1;
			}
		}
		else if (a.away < b.away) {
			return -1;
		}
		else {
			return 1;
		}
	});
	
	console.log(getMatchListDebugInfo(matchList));
	
	return matchList;
}

function getMatches(schedule, matchList) {
	//This function takes a schedule object and returns a match list from it.
	/*
	schedule = {
		"teams": []
		,"matchAmount": 0
		,"extraHome": []
	}
	*/
	
	var fullRound = getFullRound(schedule.teams);
	
	//Makes match amount an even number if both team count and match count are uneven.
	if (schedule.teams.length % 2 !== 0 && schedule.matchAmount % 2 !== 0) {
		throw new Error("Uneven amount of teams and matches.");
	}
	
	var roundMatchCount = (schedule.teams.length - 1) * 2;
	
	//Complete home-away rounds.
	if (roundMatchCount <= schedule.matchAmount) {
		var divmodObject = divmod(schedule.matchAmount, roundMatchCount);
		
		//Adds as many full rounds as the match amount supports.
		while (divmodObject.bigger > 0) {
			matchList = matchList.concat(fullRound);
			divmodObject.bigger--;
		}
		
		schedule.matchAmount = divmodObject.smaller;
	}
	
	//Incomplete rounds
	if (schedule.matchAmount > 0) {
		matchList = matchList.concat(getIncompleteRound(schedule.teams, schedule.extraHome, schedule.matchAmount, getDictFromMatchList(fullRound)));
	}
	
	return matchList;
}

function getFullRound(teams) {
	//Gives a full round, which can be copied later for other purposes.
	
	var round = [];
	
	var matchObject;
	for (var i in teams) {
		for (var i2 in teams) {
			
			if (i !== i2) {
				matchObject = {
					"home": teams[i]
					,"away": teams[i2]
				};
				
				round.push(matchObject);
			}
		}
	}
	
	return round;
}

function getIncompleteRound(teams, extraHome, matchesPerTeam, fullRound) {
	//Every team plays against one another less than two times.
	
	var teamObject = {};
	var matchObject;
	
	//Making an object which keeps track of all teams' games.
	//Represents the amount of matches they have left in both categories.
	for (var i in teams) {
		teamObject[teams[i]] = {
			"home_matches": 0
			,"away_matches": 0
			,"home_match_ids": []
			,"away_match_ids": []
		};
	}
	
	for (var id in fullRound) {
		//Adds references to all teams' match IDs in order to limit iterations.
		teamObject[fullRound[id].home].home_match_ids.push(id);
		teamObject[fullRound[id].away].away_match_ids.push(id);
	}
	
	var homeMatchCount = completeExtraHome(teamObject, matchesPerTeam, extraHome);
	
	var matchList = [];
	
	//An array consisting of matchesPerTeam.
	var matchCounts = [];
	
	if (matchesPerTeam > teams.length - 1) {
		matchCounts.push(teams.length - 1);
		matchCounts.push(matchesPerTeam - (teams.length - 1));
	}
	else {
		matchCounts.push(matchesPerTeam);
	}
	
	var teamObjectList = getTeamObjectList(teamObject, homeMatchCount, matchesPerTeam, matchCounts);
	
	for (var i = 0; i < teamObjectList.length; i++) {
		//Looped two times, because the match amount can be more than what one half-round takes.
		//For example, 15 teams and 20 matches.
		
		matchList = matchList.concat(getIncompleteRoundMatches(teamObjectList[i], copy(fullRound), matchList));
	}
	
	return matchList;
}

function completeExtraHome(teamObject, matchesPerTeam, extraHome) {
	//fills up extraHome array if needed.
	//Returns homeMatchCount so it can be used in making the teamObjectList.
	
	//console.log(copy(teamObject));
	
	var homeMatchCount = matchesPerTeam / 2;
	
	if (homeMatchCount % 1 !== 0) {
		//If amount of home matches is not a whole number.
		
		var extraHomeCount = Object.keys(teamObject).length / 2;
		
		//Rounds down homeMatchCount
		homeMatchCount = parseInt(homeMatchCount);
		
		if (extraHome.length < extraHomeCount) {
			fillExtraHome(teamObject, extraHome, extraHomeCount);
		}
		
		//console.log(copy(extraHome));
		
		for (var i in extraHome) {
			//Adding the extra home match for the ones receiving the extra home match.
			teamObject[extraHome[i]].home_matches++;
		}
		
		var extraHomeMatchCount = teamObject[extraHome[0]].home_matches;
		
		for (var team in teamObject) {
			if (teamObject[team].home_matches !== extraHomeMatchCount) {
				//Adding the extra away match for all the rest.
				teamObject[team].away_matches++;
			}
		}
	}
	
	//console.log(copy(teamObject));
	
	return homeMatchCount;
}

function fillExtraHome(teamObject, extraHome, extraHomeCount) {
	var teamDrawPool = setUpDrawPool(teamObject, extraHome);
	
	while (extraHome.length < extraHomeCount) {
		extraHome.push(randomItem(teamDrawPool, remove=true));
	}
}

function setUpDrawPool(teamObject, extraHome) {
	//Setting up the draw pool for extra home games, empty of teams that are already granted home game.
	
	var teamDrawPool = [];
	var teamInExtraHome;
	for (var team in teamObject) {
		teamInExtraHome = false;
		
		for (var i2 in extraHome) {
			if (team === extraHome[i2]) {
				teamInExtraHome = true;
				break;
			}
		}
		
		if (teamInExtraHome === false) {
			teamDrawPool.push(team);
		}
	}
	
	return teamDrawPool;
}

function swapHomeAdvantage(teamList, extraHome) {
	var inverseExtraHome = [];
	
	var teamInExtraHome;
	for (i in teamList) {
		teamInExtraHome = false;
		
		for (i2 in extraHome) {
			if (teamList[i] === extraHome[i2]) {
				teamInExtraHome = true;
				break;
			}
		}
		
		if (teamInExtraHome === false) {
			inverseExtraHome.push(teamList[i]);
		}
	}
	
	return inverseExtraHome;
}

function getIncompleteRoundMatches(teamObject, possibleMatches, alreadyScheduled) {
	var matchList = [];
	var teamHomeMatches = [];
	
	cleanMatchList(teamObject, possibleMatches, alreadyScheduled);
	
	//console.log(teamObject);
	
	var matchId;
	for (var team in teamObject) {
		while (teamObject[team].home_matches > 0) {
			matchId = randomItem(teamObject[team].home_match_ids, remove=false);
			addMatch(possibleMatches, matchList, teamObject, matchId);
			checkAllTeamsFixtureState(possibleMatches, teamObject, matchList);
		}
	}
	
	return matchList;
}

function addMatch(possibleMatches, matchList, teamObject, matchId) {
	//Adds a match from possibleMatches to matchList and goes through the required procedure.
	
	var match = possibleMatches[matchId];
	matchList.push(match);
	
	teamObject[match.home].home_matches--;
	teamObject[match.away].away_matches--;
	
	//Removes the match from the teams' match lists and possibleMatches.
	removeMatch(matchId, possibleMatches, teamObject);
	
	//Removes the "mirror game", thus making sure that the teams only face once in the round.
	removeMirrorGame(teamObject, possibleMatches, match);
	
	//Removes the matches where the team with no home or away games left is playing.
	for (var side in match) {
		//side = "home" or "away"
		checkClearMatches(teamObject, match[side], possibleMatches, side);
	}
}

function removeMatch(matchId, possibleMatches, teamObject) {
	//Removes from the teams' match lists, as well as possibleMatches.
	//side = "home" or "away"
	var team;
	
	//Removes the IDs from the teams' match lists.
	for (var side in possibleMatches[matchId]) {
		team = possibleMatches[matchId][side];
		
		for (var i in teamObject[team][side + "_match_ids"]) {
			if (teamObject[team][side + "_match_ids"][i] === matchId) {
				teamObject[team][side + "_match_ids"].splice(i, 1);
				break;
			}
		}
	}
	
	delete possibleMatches[matchId];
}

function addFixtureStateMatches(possibleMatches, matchList, teamObject, team, side) {
	//Adds matches which have been detected to be obligatory adds.
	
	while (teamObject[team][side + "_match_ids"].length > 0) {
		addMatch(possibleMatches, matchList, teamObject, teamObject[team][side + "_match_ids"][0]);
	}
}

function checkClearMatches(teamObject, team, possibleMatches, side) {
	//Removes matches if the team has no more home or away matches to play.
	//side is either "home" or "away"
	
	if (teamObject[team][side + "_matches"] === 0) {
		var matchId;
		
		while (teamObject[team][side + "_match_ids"].length > 0) {
			matchId = teamObject[team][side + "_match_ids"][0];
			removeMatch(matchId, possibleMatches, teamObject);
		}
	}
}

function removeMirrorGame(teamObject, possibleMatches, match) {
	//Removes the "mirror game" from everywhere.
	var mirrorMatchId = "";
	
	for (var i in teamObject[match.home].away_match_ids) {
		for (var i2 in teamObject[match.away].home_match_ids) {
			if (teamObject[match.home].away_match_ids[i] === teamObject[match.away].home_match_ids[i2]) {
				//Removes the mirror match ID from both teams' arrays and saves the ID for later.
				
				mirrorMatchId = teamObject[match.home].away_match_ids[i];
				
				teamObject[match.home].away_match_ids.splice(i, 1);
				teamObject[match.away].home_match_ids.splice(i2, 1);
				break;
			}
		}
		
		if (mirrorMatchId !== "") {
			break;
		}
	}
	
	if (mirrorMatchId in possibleMatches) {
		delete possibleMatches[mirrorMatchId];
	}
}

function checkAllTeamsFixtureState(possibleMatches, teamObject, matchList) {
	//Checks if any team has as many home/away games left as they have choices, and adds all those automatically in response.
	//An overkill; optimisations could be useful once functionality has been confirmed.
	
	var allClear;
	var side;
	
	var sides = [
		"home"
		,"away"
	];
	
	var teamsVisited = 0;
	
	do {
		allClear = true;
		
		for (var team in teamObject) {
			for (var i in sides) {
				side = sides[i];
				
				if (
					teamObject[team][side + "_matches"] >= teamObject[team][side + "_match_ids"].length
					&& teamObject[team][side + "_matches"] !== 0
				) {
					
					if (teamObject[team][side + "_matches"] > teamObject[team][side + "_match_ids"].length) {
						console.log(matchList);
						console.log(teamObject[team]);
						throw new Error(team + " does not have enough " + side + " matches. Teams visited: " + teamsVisited);
					}
					
					teamsVisited++;
					addFixtureStateMatches(possibleMatches, matchList, teamObject, team, side);
					
					allClear = false;
				}
			}
		}
	}
	while (allClear === false);
}

function cleanMatchList(teamObject, possibleMatches, matchList) {
	//Used before the loop so that the extreme case of just one match per team can be done.
	//Also empties the possibleMatches array from the fixtures that have already occurred.
	
	var sides = [
		"home"
		,"away"
	];
	
	//The check for zeros.
	var side;
	for (var team in teamObject) {
		for (var i in sides) {
			side = sides[i];
			
			if (teamObject[team][side + "_matches"] === 0) {
				
				while (teamObject[team][side + "_match_ids"].length > 0) {
					removeMatch(teamObject[team][side + "_match_ids"][0], possibleMatches, teamObject);
				}
				
				console.log(team + " has zeros in " + side);
			}
		}
	}
	
	//Eliminating already scheduled fixtures.
	for (var i in matchList) {
		for (var id in possibleMatches) {
			if (
				matchList[i].home === possibleMatches[id].home
				&& matchList[i].away === possibleMatches[id].away
			) {
				removeMatch(id, possibleMatches, teamObject);
				break;
			}
		}
	}
}

function teamPurge(possibleMatches, side, teamObject, team) {
	//side is either "home" or "away"
	var opponentSide = getOpponentSide(side);
	
	var id;
	var opponentTeam;
	
	while (teamObject[team][side + "_match_ids"].length > 0) {
		id = teamObject[team][side + "_match_ids"][0];
		
		otherTeam = possibleMatches[id][opponentSide];
		
		//Removes the match ID from the opponent's ID list.
		for (var i in teamObject[opponentTeam][opponentSide + "_match_ids"]) {
			if (teamObject[opponentTeam][opponentSide + "_match_ids"][i] === id) {
				teamObject[opponentTeam][opponentSide + "_match_ids"].splice(i, 1);
			}
		}
		
		//Removes the match ID from the team's list.
		teamObject[team][side + "_match_ids"].splice(0, 1);
		
		//Removes the match from the match pool.
		delete possibleMatches[id];
	}
}

function getDictFromMatchList(matchPool) {
	var matchDict = {};
	
	for (var i in matchPool) {
		matchDict["id" + (1 + parseInt(i))] = matchPool[i];
	}
	
	return matchDict;
}

function getOpponentSide(side) {
	//Gives "away" for "home" and vice versa.
	
	var opponentSide;
	
	if (side === "home") {
		opponentSide = "away";
	}
	else if (side === "away") {
		opponentSide = "home";
	}
	else {
		opponentSide = null;
	}
	
	return opponentSide;
}

function getTeamObjectList(teamObject, homeMatchCount, matchesPerTeam, matchCounts) {
	//Makes teamObjects for one or two rounds.
	
	var teamObjectList = [];
	
	//console.log(matchesPerTeam);
	
	for (var team in teamObject) {
		teamObject[team].home_matches += homeMatchCount;
		teamObject[team].away_matches += homeMatchCount;
	}
	
	for (var i = 0; i < matchCounts.length; i++) {
		teamObjectList.push(copy(teamObject));
	}
	
	if (teamObjectList.length === 2) {
		//If more than one round.
		
		for (var team in teamObjectList[1]) {
			teamObjectList[1][team].home_matches = 0;
			teamObjectList[1][team].away_matches = 0;
		}
		
		//console.log(copy(teamObjectList));
		
		var moveCount;
		
		if (Object.keys(teamObject).length % 2 === 0 && matchesPerTeam % 2 === 0) {
			//If both rounds are uneven.
			
			//moveCount leaves "half" extra matches to the first round.
			moveCount = (matchesPerTeam - Object.keys(teamObject).length) / 2;
			//console.log(moveCount);
			
			moveMatchesInTeamObjectList(teamObjectList, moveCount, 0);
			
			//After this loop, both teamObjects are ready for adding extra home and away matches.
			for (var team in teamObjectList[0]) {
				teamObjectList[0][team].home_matches--;
				teamObjectList[0][team].away_matches--;
			}
			
			//Adding the extra home and away matches.
			var extraHome = [];
			completeExtraHome(teamObjectList[0], matchCounts[0], extraHome);
			
			extraHome = swapHomeAdvantage(Object.keys(teamObjectList[0]), extraHome);
			
			completeExtraHome(teamObjectList[1], matchCounts[1], extraHome);
		}
		
		else {
			//Every other scenario.
			
			moveCount = (matchesPerTeam - (Object.keys(teamObject).length - 1)) / 2;
			
			moveMatchesInTeamObjectList(teamObjectList, moveCount, Object.keys(teamObject).length);
		}
	}
	
	return teamObjectList;
}

function moveMatchesInTeamObjectList(teamObjectList, amount, teamCount) {
	//Moves matches between the two objects.
	
	//true if uneven number
	//false if teamCount even number
	var addOne = (amount % 1 !== 0 && teamCount % 2 !== 0);
	amount = parseInt(amount);
	
	for (var team in teamObjectList[0]) {
		teamObjectList[0][team].home_matches -= amount;
		teamObjectList[0][team].away_matches -= amount;
		teamObjectList[1][team].home_matches += amount;
		teamObjectList[1][team].away_matches += amount;
		
		if (addOne === true) {
			//Evens out the first round.
			if (teamObjectList[0][team].home_matches > teamObjectList[0][team].away_matches) {
				teamObjectList[0][team].home_matches--;
				teamObjectList[1][team].home_matches++;
			}
			else {
				teamObjectList[0][team].away_matches--;
				teamObjectList[1][team].away_matches++;
			}
		}
	}
	
}

function chaoticScheduling(matches) {
	//This is the craziest and most variable schedule model.
	//It randomises the match order, and adds a new day whenever a team would play twice in the same day.
	//Finally, it randomises the match day order for some variance and excitement.
	
	var matchDays = [];
	
	var match;
	var matchDay;
	var matchDayMatch;
	var toNextDay;
	
	while (matches.length > 0) {
		toNextDay = false;
		
		match = randomItem(matches, remove=true);
		
		if (matchDays.length === 0) {
			matchDays.push([match]);
			continue;
		}
		
		matchDay = matchDays[matchDays.length - 1];
		
		for (var i in matchDay) {
			matchDayMatch = matchDay[i];
			
			for (var key in match) {
				for (var key2 in matchDayMatch) {
					if (match[key] === matchDayMatch[key2]) {
						toNextDay = true;
						matchDays.push([match]);
						break;
					}
				}
				
				if (toNextDay === true) {
					break;
				}
			}
			
			if (toNextDay === true) {
				break;
			}
		}
		
		if (toNextDay === false) {
			matchDay.push(match);
		}
	}
	
	matchDays = randomOrder(matchDays);
	
	return matchDays;
}

function structuredScheduling(matches) {
	//This is the more compact (and boring) scheduling algorithm.
	//It tries to schedule all days as full as possible.
	
	var matchObject = getDictFromMatchList(matches);
	
	var matchDays = [];
	
	var possibleMatches;
	var matchId;
	var match;
	
	while (Object.keys(matchObject).length > 0) {
		possibleMatches = copy(matchObject);
		matchDays.push([]);
		
		do {
			matchId = randomItem(Object.keys(possibleMatches), remove=false);
			match = matchObject[matchId];
			matchDays[matchDays.length - 1].push(match);
			delete matchObject[matchId];
			delete possibleMatches[matchId];
			
			for (var id in matchObject) {
				for (var side in matchObject[id]) {
					if (
						matchObject[id][side] === match.home
						|| matchObject[id][side] === match.away
					) {
						delete possibleMatches[id];
						break;
					}
				}
			}
		}
		while (Object.keys(possibleMatches).length > 0);
	}
	
	matchDays = randomOrder(matchDays);
	
	return matchDays;
}

function getMatchListDebugInfo(matchList) {
	var debugInfoObject = {};
	
	var team;
	var opponentTeam;
	
	for (var i in matchList) {
		for (var side in matchList[i]) {
			team = matchList[i][side];
			opponentTeam = matchList[i][getOpponentSide(side)];
			
			if (debugInfoObject.hasOwnProperty(team) === false) {
				debugInfoObject[team] = {
					"team_by_team": {}
				};
			}
			
			if (debugInfoObject[team].team_by_team.hasOwnProperty(opponentTeam) === false) {
				debugInfoObject[team].team_by_team[opponentTeam] = {};
			}
			
			if (debugInfoObject[team].team_by_team[opponentTeam].hasOwnProperty(side + "_matches") === false) {
				debugInfoObject[team].team_by_team[opponentTeam][side + "_matches"] = 1;
			}
			else {
				debugInfoObject[team].team_by_team[opponentTeam][side + "_matches"]++;
			}
			
			if (debugInfoObject[team].hasOwnProperty("total_" + side + "_matches") === false) {
				debugInfoObject[team]["total_" + side + "_matches"] = 1;
			}
			else {
				debugInfoObject[team]["total_" + side + "_matches"]++;
			}
		}
	}
	
	return debugInfoObject;
}





















































