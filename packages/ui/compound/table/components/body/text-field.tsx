export default function TextField(text?: string) {
  return <div className="whitespace-nowrap">{text || "-"}</div>;
}
