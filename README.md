# ⚽ Football Live Dashboard

App de fútbol con datos en tiempo real usando [football-data.org](https://www.football-data.org/).

## 📁 Estructura del proyecto

```
src/
├── App.jsx                  → Entrada principal + estilos globales
├── pages/
│   └── Home.jsx             → Página principal, orquesta todo
├── components/
│   ├── Header.jsx           → Barra superior + tabs de sección
│   ├── LeagueSelector.jsx   → Pills para seleccionar liga
│   ├── MatchCard.jsx        → Tarjeta de partido (en vivo / resultado / próximo)
│   ├── StandingsTable.jsx   → Tabla de posiciones
│   ├── LivePulse.jsx        → Indicador animado "EN VIVO"
│   ├── APIBanner.jsx        → Banner de aviso cuando se usan datos de demo
│   └── EmptyState.jsx       → Estado vacío + spinner de carga
├── hooks/
│   └── useFootballData.js   → Hook para fetch de datos (API real o mock)
├── data/
│   ├── config.js            → API key, ligas, secciones
│   └── mockData.js          → Datos de demostración
└── utils/
    └── helpers.js           → formatDate, getLeagueName
```

## 🚀 Setup

### 1. Instalá dependencias
```bash
npm install
```

### 2. Configurá tu API key gratuita

1. Registrate en https://www.football-data.org/client/register
2. Copiá tu API key del email de confirmación
3. Abrí `src/data/config.js` y reemplazá:

```js
export const API_KEY = "TU_API_KEY_AQUI";
```

### 3. Correlo
```bash
npm run dev
```

## 📦 Datos disponibles (plan gratuito)

| Dato             | Disponible |
|------------------|------------|
| Partidos en vivo | ✅         |
| Resultados       | ✅         |
| Próximos         | ✅         |
| Posiciones       | ✅         |
| Stats jugadores  | ✅ (limitado) |

## 🗺️ Ligas incluidas

| Liga           | Código |
|----------------|--------|
| Premier League | PL     |
| La Liga        | PD     |
| Serie A        | SA     |
| Bundesliga     | BL1    |
| Ligue 1        | FL1    |
