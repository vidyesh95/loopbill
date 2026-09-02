import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function storeProofFile(file: File, serviceId: number) {
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${serviceId}-${Date.now()}${ext}`;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (token) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`proof/${filename}`, file, {
      access: "public",
      token,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public/uploads/proof");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/proof/${filename}`;
}
