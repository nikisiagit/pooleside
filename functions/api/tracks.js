export async function onRequestGet(context) {
  try {
    const obj = await context.env.TRACKS_BUCKET.get('tracks.json');
    if (obj === null) {
      // Fallback to empty array if no tracks.json exists
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(obj.body, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
