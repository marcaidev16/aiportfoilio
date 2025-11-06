"use client";

export default function CalInline() {
  return (
    <iframe
      title="Reserva con Marc Bau Benavent"
      src="https://cal.com/marc-bau-benavent/30min?embed=true&layout=month_view&theme=dark&hideEventTypeDetails=false"
      style={{ width: "100%", height: "700px", border: 0 }}
      className="rounded-lg border"
      allow="clipboard-write; microphone; camera; geolocation"
    />
  );
}
