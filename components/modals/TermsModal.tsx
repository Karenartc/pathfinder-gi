"use client";

import styles from "./TermsModal.module.css";
import { X } from "lucide-react";

export default function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2>Términos y Condiciones</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </header>

        <div className={styles.content}>
          <p>
            Bienvenido/a a <strong>PathFinder GI</strong>. Nuestra plataforma educativa tiene como objetivo acompañar tu experiencia académica, brindándote módulos de aprendizaje, orientación dentro del campus, logros y notificaciones relevantes para tu vida estudiantil.
          </p>

          <h3>Uso de la Plataforma</h3>
          <p>
            Al registrarte, eres responsable de que los datos ingresados sean verídicos y actualizados. Está prohibido el uso indebido de la plataforma, el acceso no autorizado o la modificación de información institucional.
          </p>

          <h3>Datos Personales</h3>
          <p>
            La información que proporcionas (nombre, correo, carrera, etc.) se utiliza exclusivamente para fines académicos y de funcionamiento de la plataforma. No compartimos tus datos con terceros externos a la institución.
          </p>

          <h3>Notificaciones</h3>
          <p>
            Recibirás notificaciones sobre eventos, logros, avances académicos o alertas importantes. Puedes desactivarlas desde tu perfil.
          </p>

          <h3>Módulos y Logros</h3>
          <p>
            Los módulos, misiones y logros están diseñados para fomentar tu práctica autónoma y participación. Su manipulación indebida o intento de alteración está prohibido.
          </p>

          <h3>Conducta</h3>
          <p>
            Esperamos un uso respetuoso con la comunidad. Cualquier conducta inapropiada puede derivar en la suspensión del acceso.
          </p>

          <h3>Aceptación</h3>
          <p>
            Al usar PathFinder GI, aceptas estos términos y te comprometes a cumplir con las normas de uso seguro y responsable.
          </p>
        </div>
      </div>
    </div>
  );
}
