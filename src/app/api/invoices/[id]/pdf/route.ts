import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getCurrentSession } from "@/lib/session";
import { getInvoiceForPdf } from "@/lib/actions/invoices";
import { InvoiceDocument } from "@/lib/pdf/invoice-document";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { id } = await params;
  const row = await getInvoiceForPdf(Number(id));
  if (!row) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (session.user.role === "customer") {
    const [mine] = await db
      .select()
      .from(customer)
      .where(eq(customer.userId, session.user.id))
      .limit(1);
    if (!mine || mine.id !== row.invoice.customerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const buffer = await renderToBuffer(
    InvoiceDocument({
      number: row.invoice.number,
      customerName: row.customerName,
      amount: row.invoice.amount,
      status: row.invoice.status,
      issuedAt: row.invoice.issuedAt?.toISOString().slice(0, 10) ?? "",
      dueAt: row.invoice.dueAt?.toISOString().slice(0, 10) ?? "",
      serviceType: row.serviceType ?? "",
      notes: row.invoice.notes,
    }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${row.invoice.number}.pdf"`,
    },
  });
}
