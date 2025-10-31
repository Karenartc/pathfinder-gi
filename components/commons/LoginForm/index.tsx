'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import styles from './LoginForm.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};
        if (!email) newErrors.email = 'Campo requerido';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo inválido';
        if (!password) newErrors.password = 'Campo requerido';
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
        console.log('Login exitoso:', { email, password });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
        <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            fullWidth
            required
        />

        <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className={styles.actions}>
            <a href="#" className={styles.forgot}>
            ¿Olvidaste tu contraseña?
            </a>
        </div>

        <Button type="submit" variant="primary" fullWidth>
            Iniciar sesión
        </Button>

        <p className={styles.register}>
            ¿No tienes cuenta? <Link href={ROUTES.register}>Regístrate</Link>
        </p>
        </form>
    );
}
