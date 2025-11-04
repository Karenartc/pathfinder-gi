'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
    const router = useRouter(); // Hook para navegación
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

        const newErrors: Record<string, string> = {};
        if (!form.firstName) newErrors.firstName = 'Campo requerido';
        if (!form.lastName) newErrors.lastName = 'Campo requerido';
        if (!form.birthDate) newErrors.birthDate = 'Campo requerido';
        if (!form.rut) newErrors.rut = 'Campo requerido'; // Validación de RUT
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
            // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY para el backend
            const [year, month, day] = form.birthDate.split('-');
            const birthDateFormatted = `${day}/${month}/${year}`;

            // Hacer petición POST al endpoint de registro
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    birthDate: birthDateFormatted,
                    phone: form.phone,
                    email: form.email,
                    password: form.password,
                    confirmPassword: form.confirm,
                    rut: form.rut,
                    career: form.career || '',
                }),
            });

            const data = await response.json();

            // Si la respuesta no es exitosa, mostrar errores
            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    // Mostrar el primer error como error general
                    setErrors({ general: data.errors.join(', ') });
                } else {
                    setErrors({ general: data.message || 'Error al crear la cuenta' });
                }
                return;
            }

            // Registro exitoso
            console.log('Registro exitoso:', data);

            // Redirigir al home de usuario luego de registrarse
            router.push(ROUTES.userhome);
            
        } catch (error) {
            // Manejar errores de conexión
            console.error('Error en registro:', error);
            setErrors({ 
                general: 'Error de conexión. Por favor, intenta nuevamente.' 
            });
        } finally {
            // Desactivar estado de carga
            setIsLoading(false);
        }

        // Cierre del BACKEND
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Mostrar mensaje de error general del backend */}
            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}    
            {/* Nombre y Apellido */}
            <div className={styles.nameRow}>
                <Input
                    name="firstName"
                    placeholder="Nombre"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                    required
                    disabled={isLoading} // Deshabilitar durante la carga
                />
                <Input
                    name="lastName"
                    placeholder="Apellido"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
                    required
                    disabled={isLoading} // Deshabilitar durante la carga
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
                disabled={isLoading} // Deshabilitar durante la carga
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
                disabled={isLoading} // Deshabilitar durante la carga
            />

            <Input
                name="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                fullWidth
                required
                disabled={isLoading} // Deshabilitar durante la carga
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
                disabled={isLoading} // Deshabilitar durante la carga
            />

            {/* Contraseña con toggle 👁️ */}
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
                disabled={isLoading} // Deshabilitar durante la carga
            />

            {/* Confirmar contraseña con toggle 👁️ */}
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
                disabled={isLoading} // Deshabilitar durante la carga
            />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {/* Cambiar texto del botón según el estado de carga */}
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className={styles.login}>
            ¿Ya tienes una cuenta? <Link href={ROUTES.login}>Inicia sesión</Link>
        </p>
        </form>
    );
}
