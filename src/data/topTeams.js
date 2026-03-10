// Top 5 equipos de las 5 grandes ligas — IDs de API-Football (api-sports.io)
// Temporada 2024/25

export const TOP_TEAMS_BY_LEAGUE = {

  // Premier League (league: 39)
  PL: [
    { apiId: 40,  name: "Liverpool"        },
    { apiId: 42,  name: "Arsenal"          },
    { apiId: 50,  name: "Manchester City"  },
    { apiId: 66,  name: "Chelsea"          },
    { apiId: 49,  name: "Chelsea"          },
  ],

  // La Liga (league: 140)
  PD: [
    { apiId: 541, name: "Real Madrid"      },
    { apiId: 529, name: "Barcelona"        },
    { apiId: 530, name: "Atletico Madrid"  },
    { apiId: 548, name: "Villarreal"       },
    { apiId: 546, name: "Sevilla"          },
  ],

  // Serie A (league: 135)
  SA: [
    { apiId: 505, name: "Inter"            },
    { apiId: 489, name: "Napoli"           },
    { apiId: 496, name: "Juventus"         },
    { apiId: 488, name: "AC Milan"         },
    { apiId: 487, name: "Roma"             },
  ],

  // Bundesliga (league: 78)
  BL1: [
    { apiId: 157, name: "Bayern Munich"      },
    { apiId: 165, name: "Borussia Dortmund"  },
    { apiId: 168, name: "Bayer Leverkusen"   },
    { apiId: 173, name: "RB Leipzig"         },
    { apiId: 169, name: "Eintracht Frankfurt"},
  ],

  // Ligue 1 (league: 61)
  FL1: [
    { apiId: 85,  name: "Paris SG"         },
    { apiId: 91,  name: "Monaco"           },
    { apiId: 80,  name: "Lyon"             },
    { apiId: 84,  name: "Lille"            },
    { apiId: 93,  name: "Marseille"        },
  ],
};

// IDs de liga en API-Football
export const LEAGUE_API_IDS = {
  PL:  39,
  PD:  140,
  SA:  135,
  BL1: 78,
  FL1: 61,
};

export const SEASON = 2024;

// Lista plana con liga incluida
export const ALL_TOP_TEAMS = Object.entries(TOP_TEAMS_BY_LEAGUE).flatMap(
  ([leagueCode, teams]) =>
    teams.map((t) => ({
      ...t,
      leagueCode,
      leagueApiId: LEAGUE_API_IDS[leagueCode],
    }))
);
