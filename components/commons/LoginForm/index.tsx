'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/libs/firebaseConfig';
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

    const handleSubmit = async(e: React.FormEvent) => {
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
            await signInWithEmailAndPassword(auth, email, password);

            // Login exitoso - Guardar datos en localStorage
            console.log('Login exitoso:');

            // Redirigir al home de usuario luego de iniciar sesión
            router.push(ROUTES.userhome); 
            
        } catch (error: any) {
            // Manejar errores de conexión
            console.error('Error en login:', error);

            let errorMessage = 'Error al iniciar sesión.';

            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    errorMessage = 'Email o contraseña incorrectos';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este email';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Error de conexión. Verifica tu internet';
                    break;
                default:
                    errorMessage = 'Error al iniciar sesión. Intenta nuevamente';
            }

            setErrors({ general: errorMessage });

        } finally {
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
