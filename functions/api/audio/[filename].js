export async function onRequestGet(context) {
  try {
    const filename = context.params.filename;
    
    // Simple sanitization to prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return new Response('Invalid filename', { status: 400 });
    }

    const obj = await context.env.TRACKS_BUCKET.get(filename);
    if (obj === null) {
      return new Response('File not found', { status: 404 });
    }

    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('etag', obj.httpEtag);
    // Ensure browsers can cache it and seek (partial content not strictly implemented here, but good start)
    headers.set('Accept-Ranges', 'bytes');

    return new Response(obj.body, { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
