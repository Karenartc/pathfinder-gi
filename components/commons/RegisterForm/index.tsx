'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/libs/firebaseConfig';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import styles from './RegisterForm.module.css';

// Carreras válidas del sistema
const VALID_CAREERS = [
    "Diseño Gráfico",
    "Ingeniería Informática",
    "Ingeniería Automatización",
    "Administración de Empresas",
];

export default function RegisterForm() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        email: '',
        password: '',
        confirm: '',
        rut: '',
        career: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado de carga para deshabilitar el formulario

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Limpiar errores previos antes de validar nuevamente

        //Validaciones
        const newErrors: Record<string, string> = {};
        if (!form.firstName) newErrors.firstName = 'Campo requerido';
        if (!form.lastName) newErrors.lastName = 'Campo requerido';
        if (!form.birthDate) newErrors.birthDate = 'Campo requerido';
        if (!form.rut) newErrors.rut = 'Campo requerido';
        if (!form.career) newErrors.career = 'Debes seleccionar una carrera';
        if (!form.phone) newErrors.phone = 'Campo requerido';
        if (!form.email) newErrors.email = 'Campo requerido';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
        if (!form.password) newErrors.password = 'Campo requerido';
        if (form.password !== form.confirm) newErrors.confirm = 'Las contraseñas no coinciden';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Lamada al BACKEND

        setIsLoading(true); // Activar estado de carga

        try {
            // Crear usuario en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            const user = userCredential.user;

            // Crear documento en Firestore
            const fullName = `${form.firstName} ${form.lastName}`;
            
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                fullName: fullName,
                rut: form.rut,
                phone: form.phone,
                birthDate: form.birthDate,
                career: form.career,
                role: "student",
                totalPoints: 0,
                avatarUrl: "/images/fox-avatar.png",
                preferences: {
                    darkMode: false,
                    notificationsEnabled: true,
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            console.log("Registro exitoso");
            
            // Redirigir al dashboard
            router.push(ROUTES.userhome);
            
        } catch (error: any) {
            console.error("Error en registro:", error);
            
            let errorMessage = "Error al registrarse";
            
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Este email ya está registrado";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "La contraseña debe tener al menos 6 caracteres";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Email inválido";
            } else if (error.code?.includes('permission-denied')) {
                errorMessage = "Error de permisos. Contacta al administrador";
            }
            
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };
    // Cierre del BACKEND

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}    

            <div className={styles.nameRow}>
                <Input
                    name="firstName"
                    placeholder="Nombre"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                    required
                    disabled={isLoading}
                />
                <Input
                    name="lastName"
                    placeholder="Apellido"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
                    required
                    disabled={isLoading}
                />
            </div>

            <Input
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                error={errors.birthDate}
                fullWidth
                required
                disabled={isLoading}
            />

            <Input
                name="rut"
                type="text"
                placeholder="RUT (12345678-9)"
                value={form.rut}
                onChange={handleChange}
                error={errors.rut}
                fullWidth
                required
                disabled={isLoading}
            />

            {/* Campo de Carrera */}
            <div className={styles.inputWrapper}>
                <label htmlFor="career" className={styles.label}>
                    Carrera <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                    id="career"
                    name="career"
                    value={form.career}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.career ? styles.selectError : ''}`}
                    required
                    disabled={isLoading}
                    aria-label="Selecciona tu carrera"
                >
                    <option value="" disabled>
                        Selecciona tu carrera
                    </option>
                    {VALID_CAREERS.map((career) => (
                        <option key={career} value={career}>
                            {career}
                        </option>
                    ))}
                </select>
                {errors.career && (
                    <span className={styles.errorText}>{errors.career}</span>
                )}
            </div>

            <Input
                name="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                fullWidth
                required
                disabled={isLoading}
            />

            <Input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
                required
                disabled={isLoading}
            />

            <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                rightAction={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.iconButton}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                fullWidth
                required
                disabled={isLoading}
            />

            <Input
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                value={form.confirm}
                onChange={handleChange}
                error={errors.confirm}
                rightAction={
                    <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className={styles.iconButton}
                        aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                fullWidth
                required
                disabled={isLoading}
            />

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <p className={styles.login}>
                ¿Ya tienes una cuenta? <Link href={ROUTES.login}>Inicia sesión</Link>
            </p>
        </form>
    );
}
