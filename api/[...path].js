export default async function handler(req, res) {
  const { path } = req.query;
  const apiPath  = Array.isArray(path) ? path.join('/') : path || '';
  
  // Reconstruir query string (sin el parámetro "path")
  const query = { ...req.query };
  delete query.path;
  const qs = new URLSearchParams(query).toString();
  
  const url = `https://api.football-data.org/v4/${apiPath}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': '8b753a3c1bb6402f87dcd23c5ed0aa94',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}






























































