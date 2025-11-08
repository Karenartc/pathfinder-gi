"use client";
import "@/app/globals.css";
import styles from "./admin.module.css";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/"); // simula cerrar sesión y volver al inicio
  };

  return (
    <section className={styles.adminLayout}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}
