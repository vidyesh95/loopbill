import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { lead } from "@/lib/db/schema";
import { getServiceBySlug } from "@/lib/data/services";
import { getPublicCompany, getPublicServiceBySlug } from "@/lib/public-site";
import { leadRequestSchema } from "@/lib/leads";

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim(),
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the form and try again." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const name = `${data.firstName} ${data.lastName}`.replace(/\s+/g, " ").trim();
  const [company, published] = await Promise.all([
    getPublicCompany(),
    getPublicServiceBySlug(data.service),
  ]);
  const serviceTitle = published?.title ?? getServiceBySlug(data.service)?.title ?? data.service;

  try {
    await db.insert(lead).values({
      name,
      email: data.email,
      phone: data.phone,
      propertyType: data.propertyType,
      service: data.service,
      message: data.message,
      source: data.source,
      status: "new",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to save lead", error);
    return NextResponse.json(
      { ok: false, message: "Unable to save your enquiry. Please try again." },
      { status: 500 },
    );
  }

  if (!smtpConfigured()) {
    console.warn("Lead saved without email: SMTP env vars are not set.");
    return NextResponse.json({ ok: true, emailed: false });
  }

  const textContent = `
New website enquiry

Name          : ${name}
Email         : ${data.email}
Phone         : ${data.phone}
Property type : ${data.propertyType}
Service       : ${serviceTitle}
Source        : ${data.source}

Message:
${data.message}
`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.SMTP_USER}>`,
      to: company.email,
      replyTo: data.email,
      subject: `New website enquiry — ${serviceTitle}`,
      text: textContent,
    });
  } catch (error) {
    console.error("Lead saved but email failed", error);
    return NextResponse.json({ ok: true, emailed: false });
  }

  return NextResponse.json({ ok: true, emailed: true });
}
