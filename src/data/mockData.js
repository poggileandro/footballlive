export const MOCK = {
  live: [
    { id: 1, homeTeam: { name: "Arsenal" }, awayTeam: { name: "Chelsea" }, score: { fullTime: { home: 2, away: 1 } }, minute: 67, competition: "Premier League" },
    { id: 2, homeTeam: { name: "Real Madrid" }, awayTeam: { name: "Barcelona" }, score: { fullTime: { home: 1, away: 1 } }, minute: 45, competition: "La Liga" },
    { id: 3, homeTeam: { name: "Bayern Munich" }, awayTeam: { name: "Dortmund" }, score: { fullTime: { home: 3, away: 0 } }, minute: 82, competition: "Bundesliga" },
  ],
  results: [
    { id: 10, homeTeam: { name: "Liverpool" }, awayTeam: { name: "Man City" }, score: { fullTime: { home: 3, away: 1 } }, utcDate: "2026-03-08T15:00:00Z", competition: "Premier League" },
    { id: 11, homeTeam: { name: "Atletico Madrid" }, awayTeam: { name: "Sevilla" }, score: { fullTime: { home: 2, away: 2 } }, utcDate: "2026-03-08T18:00:00Z", competition: "La Liga" },
    { id: 12, homeTeam: { name: "Juventus" }, awayTeam: { name: "Inter Milan" }, score: { fullTime: { home: 1, away: 0 } }, utcDate: "2026-03-07T20:45:00Z", competition: "Serie A" },
    { id: 13, homeTeam: { name: "PSG" }, awayTeam: { name: "Marseille" }, score: { fullTime: { home: 4, away: 0 } }, utcDate: "2026-03-07T20:00:00Z", competition: "Ligue 1" },
  ],
  upcoming: [
    { id: 20, homeTeam: { name: "Tottenham" }, awayTeam: { name: "Man Utd" }, utcDate: "2026-03-12T20:00:00Z", competition: "Premier League" },
    { id: 21, homeTeam: { name: "Valencia" }, awayTeam: { name: "Real Madrid" }, utcDate: "2026-03-13T21:00:00Z", competition: "La Liga" },
    { id: 22, homeTeam: { name: "AC Milan" }, awayTeam: { name: "Napoli" }, utcDate: "2026-03-14T20:45:00Z", competition: "Serie A" },
    { id: 23, homeTeam: { name: "Leipzig" }, awayTeam: { name: "Leverkusen" }, utcDate: "2026-03-15T17:30:00Z", competition: "Bundesliga" },
  ],
  standings: {
    PL: [
      { position: 1, team: { name: "Man City"    }, playedGames: 28, won: 20, draw: 4, lost: 4,  goalsFor: 65, goalsAgainst: 28, goalDifference: 37,  points: 64 },
      { position: 2, team: { name: "Arsenal"     }, playedGames: 28, won: 19, draw: 5, lost: 4,  goalsFor: 61, goalsAgainst: 30, goalDifference: 31,  points: 62 },
      { position: 3, team: { name: "Liverpool"   }, playedGames: 28, won: 18, draw: 6, lost: 4,  goalsFor: 70, goalsAgainst: 35, goalDifference: 35,  points: 60 },
      { position: 4, team: { name: "Aston Villa" }, playedGames: 28, won: 17, draw: 4, lost: 7,  goalsFor: 58, goalsAgainst: 38, goalDifference: 20,  points: 55 },
      { position: 5, team: { name: "Tottenham"   }, playedGames: 28, won: 14, draw: 5, lost: 9,  goalsFor: 52, goalsAgainst: 45, goalDifference: 7,   points: 47 },
      { position: 6, team: { name: "Chelsea"     }, playedGames: 28, won: 12, draw: 7, lost: 9,  goalsFor: 50, goalsAgainst: 42, goalDifference: 8,   points: 43 },
      { position: 7, team: { name: "Newcastle"   }, playedGames: 28, won: 12, draw: 6, lost: 10, goalsFor: 48, goalsAgainst: 44, goalDifference: 4,   points: 42 },
      { position: 8, team: { name: "Man Utd"     }, playedGames: 28, won: 11, draw: 5, lost: 12, goalsFor: 35, goalsAgainst: 44, goalDifference: -9,  points: 38 },
    ],
    PD: [
      { position: 1, team: { name: "Real Madrid"    }, playedGames: 27, won: 21, draw: 3, lost: 3, goalsFor: 68, goalsAgainst: 24, goalDifference: 44, points: 66 },
      { position: 2, team: { name: "Barcelona"      }, playedGames: 27, won: 19, draw: 4, lost: 4, goalsFor: 62, goalsAgainst: 32, goalDifference: 30, points: 61 },
      { position: 3, team: { name: "Atletico"       }, playedGames: 27, won: 16, draw: 5, lost: 6, goalsFor: 50, goalsAgainst: 35, goalDifference: 15, points: 53 },
      { position: 4, team: { name: "Athletic Club"  }, playedGames: 27, won: 15, draw: 4, lost: 8, goalsFor: 44, goalsAgainst: 30, goalDifference: 14, points: 49 },
      { position: 5, team: { name: "Villarreal"     }, playedGames: 27, won: 13, draw: 6, lost: 8, goalsFor: 42, goalsAgainst: 38, goalDifference: 4,  points: 45 },
    ],
    SA: [
      { position: 1, team: { name: "Inter Milan" }, playedGames: 27, won: 20, draw: 5, lost: 2, goalsFor: 63, goalsAgainst: 22, goalDifference: 41, points: 65 },
      { position: 2, team: { name: "Juventus"    }, playedGames: 27, won: 18, draw: 4, lost: 5, goalsFor: 51, goalsAgainst: 28, goalDifference: 23, points: 58 },
      { position: 3, team: { name: "Milan"       }, playedGames: 27, won: 16, draw: 5, lost: 6, goalsFor: 52, goalsAgainst: 34, goalDifference: 18, points: 53 },
      { position: 4, team: { name: "Napoli"      }, playedGames: 27, won: 15, draw: 6, lost: 6, goalsFor: 50, goalsAgainst: 30, goalDifference: 20, points: 51 },
      { position: 5, team: { name: "Atalanta"    }, playedGames: 27, won: 15, draw: 4, lost: 8, goalsFor: 58, goalsAgainst: 38, goalDifference: 20, points: 49 },
    ],
    BL1: [
      { position: 1, team: { name: "Bayern Munich" }, playedGames: 26, won: 19, draw: 3, lost: 4, goalsFor: 70, goalsAgainst: 30, goalDifference: 40, points: 60 },
      { position: 2, team: { name: "Leverkusen"    }, playedGames: 26, won: 17, draw: 5, lost: 4, goalsFor: 55, goalsAgainst: 28, goalDifference: 27, points: 56 },
      { position: 3, team: { name: "Dortmund"      }, playedGames: 26, won: 14, draw: 4, lost: 8, goalsFor: 50, goalsAgainst: 40, goalDifference: 10, points: 46 },
      { position: 4, team: { name: "Leipzig"       }, playedGames: 26, won: 13, draw: 5, lost: 8, goalsFor: 45, goalsAgainst: 38, goalDifference: 7,  points: 44 },
    ],
    FL1: [
      { position: 1, team: { name: "PSG"       }, playedGames: 27, won: 22, draw: 3, lost: 2, goalsFor: 65, goalsAgainst: 22, goalDifference: 43, points: 69 },
      { position: 2, team: { name: "Monaco"    }, playedGames: 27, won: 16, draw: 5, lost: 6, goalsFor: 52, goalsAgainst: 35, goalDifference: 17, points: 53 },
      { position: 3, team: { name: "Marseille" }, playedGames: 27, won: 14, draw: 6, lost: 7, goalsFor: 45, goalsAgainst: 35, goalDifference: 10, points: 48 },
      { position: 4, team: { name: "Lyon"      }, playedGames: 27, won: 13, draw: 5, lost: 9, goalsFor: 42, goalsAgainst: 38, goalDifference: 4,  points: 44 },
    ],
  },
};
