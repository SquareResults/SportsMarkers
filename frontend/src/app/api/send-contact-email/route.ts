import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, topic, sport, message } = body;

  const emailContent = `
    Name: ${name}
    Email: ${email}
    Phone: ${phone || "Not provided"}
    Topic: ${topic}
    Sport: ${sport || "Not provided"}
    Message: ${message}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@squareresults.com",
      to: "nithish952001@gmail.com",
      subject: "New Contact Form Submission",
      text: emailContent,
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
