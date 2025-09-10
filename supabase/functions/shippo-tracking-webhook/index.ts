import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await req.json();

  // Process payload
  console.log("Webhook received:", payload);

  return new Response(
    JSON.stringify({ message: "Webhook received successfully!" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});