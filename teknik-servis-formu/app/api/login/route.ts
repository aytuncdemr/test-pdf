export async function POST(request: Request) {
	const data = await request.json();

	if (data.name === process.env.u1 && data.password === process.env.u2) {
		return new Response("success", { status: 200 });
	}

	return new Response("Error login", { status: 500 });
}
