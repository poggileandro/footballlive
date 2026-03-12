export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);

  // En Vercel edge, el pathname incluye /api/[...path]
  // Necesitamos quitar solo el prefijo /api
  let apiPath = url.pathname;
  
  // Quitar /api del inicio
  if (apiPath.startsWith('/api')) {
    apiPath = apiPath.slice(4); // quita "/api"
  }
  
  // Si quedó vacío, usar /
  if (!apiPath || apiPath === '') apiPath = '/';

  const targetUrl = `https://api.football-data.org/v4${apiPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'X-Auth-Token': '8b753a3c1bb6402f87dcd23c5ed0aa94',
        'Content-Type': 'application/json',
        'X-Unfold-Goals': req.headers.get('X-Unfold-Goals') || '',
      },
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        // Debug: devolver la URL que se llamó
        'X-Debug-URL': targetUrl,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ 
      error: err.message,
      debugPath: apiPath,
      debugUrl: targetUrl,
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
