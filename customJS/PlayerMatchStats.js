//Getters

function getPlayerMatchPoints(stats) {
	return stats.goals + stats.assists;
}

function getShotsAgainstGoalie(stats) {
	return stats.saves + stats.conceded;
}

function getPlayerShotPct(stats) {
	return convertToPct(stats.goals / stats.shots);
}

function getGoalieSavePct(stats) {
	return convertToPct(stats.saves / getShotsAgainstGoalie(stats));
}