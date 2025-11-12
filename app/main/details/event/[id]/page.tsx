import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import DetailHeader from "@/components/details/DetailHeader";
import InfoChip from "@/components/details/InfoChip";
import DetailSection from "@/components/details/DetailSection";
import styles from "@/components/details/detail.module.css";

export const revalidate = 0; // 🔁 Siempre datos frescos

// 🗓️ Formatear fecha
function formatDateLong(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(d);
  } catch {
    return iso;
  }
}

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  /* 🌐 Detectar el entorno automáticamente */
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    // 🔍 Pedir el evento al backend real
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`❌ Error al cargar evento ${id}:`, res.status);
      return notFound();
    }

    const data = await res.json();
    if (!data.ok || !data.event) return notFound();

    const event = data.event;
    const dateLabel = formatDateLong(event.dateISO);
    const placeLabel = event.place;
    const imageSrc = event.imageUrl || "/images/default-event.jpg";

    return (
      <div>
        {/* 🔷 Imagen de portada */}
        <DetailHeader
          image={imageSrc}
          titleOverlap="Detalles del Evento"
          backHref="/main/dashboard"
        />

        {/* 🔹 Contenido */}
        <div className={styles.wrapper}>
          <h1 className={styles.title}>{event.title}</h1>

          <div className={styles.infoRow}>
            <InfoChip
              icon={<MapPin size={18} />}
              title={placeLabel || "Lugar no especificado"}
              subtitle="Sede Institucional"
            />
            <InfoChip
              icon={<CalendarDays size={18} />}
              title={dateLabel || "Fecha no especificada"}
              subtitle="Horario por confirmar"
            />
          </div>

          <DetailSection title="Acerca del evento">
            <p>{event.description}</p>
          </DetailSection>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("💥 Error al cargar detalle del evento:", error);
    return notFound();
  }
}
