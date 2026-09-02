import { getCmsRows } from "@/lib/public-site";
import WebsiteClient from "./website-client";

export default async function WebsiteCms() {
  const data = await getCmsRows();
  return <WebsiteClient {...data} />;
}
