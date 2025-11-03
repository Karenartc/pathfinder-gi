'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/libs/routes';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; 
import styles from './LoginForm.module.css';

export default function LoginForm() {
    const router = useRouter(); // Hook para navegación
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false); // Estado de carga para deshabilitar el formulario

    const handleSubmit = async(e: React.FormEvent) => {0
        e.preventDefault();

        setErrors({}); // Limpiar errores previos antes de validar nuevamente

        const newErrors: typeof errors = {};
        if (!email) newErrors.email = 'Campo requerido';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo inválido';

        if (!password) newErrors.password = 'Campo requerido';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Lamada al BACKEND

        setIsLoading(true); // Activar estado de carga

        try {
            // Hacer petición POST al endpoint de login
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            // Si la respuesta no es exitosa, mostrar error
            if (!response.ok) {
                if (data.errors && Array.isArray(data.errors)) {
                    setErrors({ general: data.errors.join(', ') });
                } else {
                    setErrors({ general: data.message || 'Error al iniciar sesión' });
                }
                return;
            }

            // Login exitoso - Guardar datos en localStorage
            console.log('Login exitoso:', data);

            // Guardar token de autenticación
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Guardar información del usuario
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            // Redirigir a '' después del login exitoso
            router.push('/'); //Cambiar esta ruta de redirección.
            
        } catch (error) {
            // Manejar errores de conexión
            console.error('Error en login:', error);
            setErrors({ 
                general: 'Error de conexión. Por favor, intenta nuevamente.' 
            });
        } finally {
            // Desactivar estado de carga
            setIsLoading(false);
        }
        // FIN DE LLAMADA AL BACKEND
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {errors.general && (
                <div className={styles.errorMessage}>
                    {errors.general}
                </div>
            )}    
        <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            fullWidth
            required
            disabled={isLoading} // Deshabilitar durante la carga
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
                disabled={isLoading} // Deshabilitar durante la carga
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            }
            fullWidth
            required
            disabled={isLoading} // Deshabilitar durante la carga
        />

        <div className={styles.actions}>
            <a href="#" className={styles.forgot}>
            ¿Olvidaste tu contraseña?
            </a>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <p className={styles.register}>
            ¿No tienes cuenta? <Link href={ROUTES.register}>Regístrate</Link>
        </p>
        </form>
    );
}
