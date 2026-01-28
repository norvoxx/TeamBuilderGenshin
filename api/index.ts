Bun.serve({
    port: 1312,
    async fetch(req) {
        const url = new URL(req.url)
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Content-Type"
        }
        if (req.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders })
        }
        if (url.pathname === "/api/acceuil") {
            const file = Bun.file("./data/caracters.json")
            const json = await file.json()
            return new Response(
                JSON.stringify(json),
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...corsHeaders
                    }
                }
            )
        }

        return new Response("Not found", {
            status: 404,
            headers: corsHeaders
        })
    }
})
