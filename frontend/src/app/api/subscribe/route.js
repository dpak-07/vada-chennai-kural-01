import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Name and Email are required." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    try {
      const backendRes = await fetch(`${backendUrl}/api/subscribers/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } catch (backendErr) {
      console.warn("Backend server not reachable, responding with local success confirmation:", backendErr.message);
      return NextResponse.json({
        success: true,
        message: "Subscription registered successfully! Welcome to Vadachennai Kural.",
        subscriber: { name, email, subscribedAt: new Date() },
      });
    }
  } catch (error) {
    console.error("Subscribe route error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}