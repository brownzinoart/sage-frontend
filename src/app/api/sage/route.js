// Import the Netlify function logic using dynamic import to avoid CommonJS issues

export async function POST(request) {
  try {
    // Get request body
    const body = await request.json();
    
    // Dynamic import to avoid CommonJS issues
    const { handler } = await import('../../../../netlify/functions/sage.js');
    
    // Convert Next.js request to Netlify function format
    const netlifyEvent = {
      httpMethod: 'POST',
      body: JSON.stringify(body),
      headers: Object.fromEntries(request.headers.entries())
    };
    
    // Call the Netlify function
    const result = await handler(netlifyEvent, {});
    
    // Parse response body
    const responseData = JSON.parse(result.body);
    
    // Return response with proper headers
    return Response.json(responseData, {
      status: result.statusCode,
      headers: result.headers || {}
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response('', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}