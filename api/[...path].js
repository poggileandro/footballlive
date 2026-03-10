export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);

  // url.pathname = /api/competitions/PL/matches
  // apiPath      =     /competitions/PL/matches
  const apiPath   = url.pathname.replace(/^\/api/, '');
  const targetUrl = `https://api.football-data.org/v4${apiPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'X-Auth-Token': '8b753a3c1bb6402f87dcd23c5ed0aa94',
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
