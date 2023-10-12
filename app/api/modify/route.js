export async function POST(req) {
  const body = await req.json();
  return new Response(`Hello ${body.name}!`);
}
