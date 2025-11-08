"use client";

import Image from "next/image";
import styles from "./NavbarAdmin.module.css";
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoBox}>
          <Image
            src="/images/PathFinder-Logo.png"
            alt="PathFinder"
            width={160}
            height={36}
            className={styles.logo}
            priority
          />
        </div>

        {/* Perfil */}
        <div className={styles.profile} onClick={() => setOpen(!open)}>
          <Image
            src="/icons/PathFox-logo-512x512.png"
            alt="Admin"
            width={36}
            height={36}
            className={styles.avatar}
          />
          <span className={styles.username}>Administrador</span>
          <ChevronDown size={16} />
        </div>

        {/* Modal */}
        {open && (
          <div className={styles.dropdown}>
            <button onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
