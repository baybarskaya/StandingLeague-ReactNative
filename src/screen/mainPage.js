import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  fetchCompetitions,
  fetchTeams,
  fetchPlayers,
  fetchStandings,
} from "../component/api.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MainPage = () => {
  const [competitions, setCompetitions] = useState([]);
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeamLogo, setSelectedTeamLogo] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competitionsData = await fetchCompetitions();

        setCompetitions(competitionsData);
      } catch (error) {
        Alert.alert("Error", "Error fetching competitions data");
        console.error("Error fetching competitions data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCompetitionClick = async (leagueId) => {
    try {
      const standingsData = await fetchStandings(leagueId);
      setStandings(standingsData);
    } catch (error) {
      Alert.alert("Error", "Error fetching standings data");
      console.error("Error fetching standings data:", error);
    }
  };

  const handleTeamClick = async (leagueId) => {
    try {
      const teamsData = await fetchTeams(leagueId);
      setTeams(teamsData);
      if (teamsData.length > 0) {
        const firstTeam = teamsData[0];
        setSelectedTeamLogo(firstTeam.team_badge);

        handlePlayerClick(firstTeam.team_key, leagueId, teamsData);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching teams or players data");
      console.error("Error fetching teams or players data:", error);
    }
  };

  const handlePlayerClick = async (teamId, leagueId, selectedTeam) => {
    try {
      // Filter players based on the selected team
      const selectedPlayers =
        selectedTeam.find((team) => team.team_key === teamId)?.players || [];
      setPlayers(selectedPlayers);
    } catch (error) {
      Alert.alert("Error", "Error fetching players data");
      console.error("Error fetching players data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Football App</Text>
      <FlatList
        data={competitions}
        keyExtractor={(item) => item.league_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              handleCompetitionClick(item.league_id);
              handleTeamClick(item.league_id);
            }}
          >
            <View style={styles.listItem}>
              <Image
                source={{ uri: item.league_logo }}
                style={styles.leagueLogo}
              />
              <Text style={styles.leagueName}>{item.league_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {standings && standings.length > 0 && (
        <View style={styles.standingsContainer}>
          <Text style={styles.heading}>Standings</Text>
          <FlatList
            data={standings}
            keyExtractor={(item) => item.team_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTeamLogo(item.team_badge);
                }}
              >
                <View style={styles.listItem}>
                  <Image
                    source={{ uri: item.team_badge }}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.standingsTeamName}>{item.team_name}</Text>
                  <Text style={styles.standingsPosition}>
                    {item.overall_league_position}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {teams && teams.length > 0 && (
        <View style={styles.teamsContainer}>
          <Text style={styles.heading}>Teams</Text>
          <FlatList
            data={teams}
            keyExtractor={(item) => item.team_key}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  handlePlayerClick(item.team_key, item.league_id, teams);
                  setSelectedTeamLogo(item.team_badge);
                }}
              >
                <View style={styles.listItem}>
                  <Image
                    source={{ uri: item.team_badge }}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.teamName}>{item.team_name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {players && players.length > 0 && (
        <View style={styles.playersContainer}>
          <Text style={styles.heading}>Players</Text>
          <FlatList
            data={players}
            keyExtractor={(item) => item.player_key}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTeamLogo(item.team_badge);
                }}
              >
                <View style={styles.listItem}>
                  {item.player_image ? (
                    <Image
                      source={{ uri: item.player_image }}
                      style={styles.playerPhoto}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={40}
                      color="#555"
                      style={styles.defaultPlayerIcon}
                    />
                  )}
                  <View style={styles.playerInfoContainer}>
                    <Text style={styles.playerName}>{item.player_name}</Text>
                    <Text style={styles.jerseyNumber}>
                      #{item.player_number}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  leagueLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  leagueName: {
    fontSize: 16,
  },
  standingsContainer: {
    marginTop: 16,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  standingsTeamName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  standingsPosition: {
    fontSize: 16,
    marginLeft: "auto",
    fontWeight: "bold",
  },
  teamsContainer: {
    marginTop: 16,
  },
  teamName: {
    fontSize: 16,
  },
  playersContainer: {
    marginTop: 16,
  },
  playerName: {
    fontSize: 16,
  },
  playerPhoto: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 20, // Assuming you want rounded player photos
  },
  playerInfoContainer: {
    flexDirection: "column",
    marginLeft: 8,
  },
  jerseyNumber: {
    fontSize: 14,
    color: "#555",
  },
  defaultPlayerIcon: {
    width: 40,
    height: 40,
  },
});

export default MainPage;
