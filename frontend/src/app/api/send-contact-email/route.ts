import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const logoUrl = `${protocol}://${host}/images/logo.png`;

  const body = await request.json();
  const { name, email, phone, topic, sport, message } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@squareresults.com",
      to: "contact@sportsmarker.com",
      subject: `New Inquiry from SportsMarker for ${name}: ${topic}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          <p>You have received a new message from your website's contact form.</p>
          <hr style="border: 1px solid #e2e8f0;">
          <h3 style="color: #334155;">Submission Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
            <li><strong>Topic:</strong> ${topic}</li>
            <li><strong>Sport:</strong> ${sport || "Not provided"}</li>
          </ul>
          <h3 style="color: #334155;">Message:</h3>
          <p style="background-color: #f1f5f9; padding: 1rem; border-radius: 0.5rem;">${message}</p>
          <hr style="border: 1px solid #e2e8f0; margin-top: 1.5rem;">
          <div style="text-align: center; margin-top: 1.5rem;">
            <img src="${logoUrl}" alt="SportsMarkers Logo" style="width: 48px; height: 48px; margin: 0 auto;">
            <p style="font-size: 0.9rem; color: #334155; margin-top: 0.5rem;">
              <strong>SportsMarkers</strong>
            </p>
            <p style="font-size: 0.8rem; color: #64748b;">
              SportsMarkers HQ, 410 N Scottsdale Rd, Tempe, AZ 85288
            </p>
            <p style="font-size: 0.8rem; color: #64748b;">
              <a href="https://www.sportsmarkers.com" style="color: #2563eb;">www.sportsmarkers.com</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
