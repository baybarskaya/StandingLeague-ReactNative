import axios from "axios";

const apiKey =
  "c68f3c3942224073941cdf24b21fd8ca435ed6915ad7bfe948241d6356218183";

const fetchCompetitions = async () => {
  const url = `https://apiv3.apifootball.com/?action=get_leagues&country_id=6&APIkey=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

const fetchTeams = async (leagueId) => {
  const url = `https://apiv3.apifootball.com/?action=get_teams&league_id=${leagueId}&APIkey=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

const fetchPlayers = async (teamId, leagueId) => {
  const url = `https://apiv3.apifootball.com/?action=get_team_players&team_id=${teamId}&league_id=${leagueId}&APIkey=${apiKey}`;
  try {
    const response = await axios.get(url);
    const selectedTeam = response.data.find((team) => team.team_key === teamId);
    if (selectedTeam) {
      const selectedPlayers = selectedTeam.players;
      console.log("Selected Players:", selectedPlayers);
      return selectedPlayers;
    } else {
      console.error("No team data found in the response");
    }
  } catch (error) {
    console.error("Error fetching players:", error);
    throw error;
  }
};

const fetchStandings = async (leagueId) => {
  const url = `https://apiv3.apifootball.com/?action=get_standings&league_id=${leagueId}&APIkey=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching standings:", error);
    throw error;
  }
};

export { fetchCompetitions, fetchTeams, fetchPlayers, fetchStandings };
