export async function geocodeAddress(address: string) {
  const query = address.trim();
  if (!query) {
    return null;
  }
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  const response = await fetch(url, {
    headers: {
      "User-Agent": "LoopBill/0.1 (https://github.com/loopbill)",
    },
  });
  if (!response.ok) {
    return null;
  }
  const rows = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = rows[0];
  if (!first) {
    return null;
  }
  return { lat: first.lat, lng: first.lon };
}
