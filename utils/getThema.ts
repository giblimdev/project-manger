// utils/getThema.ts

export default async function getThema(): Promise<string[] | null> {
  try {
    const res = await fetch("/api/getThema");
    if (!res.ok) return null;
    const data = await res.json();
    return data.thema || null;
  } catch {
    return null;
  }
}
