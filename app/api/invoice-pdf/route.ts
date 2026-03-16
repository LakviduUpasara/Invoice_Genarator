import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface InvoicePdfPayload {
  invoiceHtml?: string;
  headStyles?: string;
  origin?: string;
  fileName?: string;
}

function sanitizeFileName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) {
    return "invoice";
  }

  return trimmed.replace(/[^\w.-]+/g, "_");
}

function safeOrigin(origin: string) {
  try {
    const parsed = new URL(origin);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.origin;
    }
  } catch {
    // Invalid origin provided by client.
  }

  return "";
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as InvoicePdfPayload;
  const invoiceHtml = payload.invoiceHtml ?? "";
  const headStyles = payload.headStyles ?? "";
  const origin = safeOrigin(payload.origin ?? "");
  const fileName = sanitizeFileName(payload.fileName ?? "invoice");

  if (!invoiceHtml || !headStyles || !origin) {
    return NextResponse.json({ error: "Invalid PDF payload." }, { status: 400 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    const html = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <base href="${origin}/" />
          ${headStyles}
        </head>
        <body class="pdf-export">
          ${invoiceHtml}
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    await page.evaluate(async () => {
      if ("fonts" in document) {
        await document.fonts.ready;
      }
    });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm"
      }
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  } finally {
    await browser.close();
  }
}
