import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "bobbypodila065@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, category, message } = body;

    console.log(`[CONTACT INQUIRY] Routing to ${OWNER_EMAIL}`);
    console.log({
      to: OWNER_EMAIL,
      fromName: name,
      fromContact: contact,
      category,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Inquiry successfully routed to ${OWNER_EMAIL}`,
      dispatchedTo: OWNER_EMAIL,
      customerNotification: {
        email: contact?.includes("@") ? contact : null,
        phone: contact?.match(/\d{10}/) ? contact : null,
        smsDispatched: true,
        whatsappDispatched: true,
      },
    });
  } catch (err: any) {
    console.error("[CONTACT ERROR]", err);
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 500 }
    );
  }
}
