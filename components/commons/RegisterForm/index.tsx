'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // 👈 Importamos los íconos
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        email: '',
        password: '',
        confirm: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!form.firstName) newErrors.firstName = 'Campo requerido';
        if (!form.lastName) newErrors.lastName = 'Campo requerido';
        if (!form.birthDate) newErrors.birthDate = 'Campo requerido';
        if (!form.phone) newErrors.phone = 'Campo requerido';
        if (!form.email) newErrors.email = 'Campo requerido';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Correo inválido';
        if (!form.password) newErrors.password = 'Campo requerido';
        if (form.password !== form.confirm) newErrors.confirm = 'Las contraseñas no coinciden';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
        console.log('Registro exitoso:', form);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
            />
            <Input
            name="lastName"
            placeholder="Apellido"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            fullWidth
            required
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
        />

        <Button type="submit" variant="primary" fullWidth>
            Crear cuenta
        </Button>

        <p className={styles.login}>
            ¿Ya tienes una cuenta? <Link href={ROUTES.login}>Inicia sesión</Link>
        </p>
        </form>
    );
}
