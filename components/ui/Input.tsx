
'use client';
import React from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightAction?: React.ReactNode; 
    fullWidth?: boolean;
};

export default function Input({
    id,
    helperText,
    error,
    leftIcon,
    rightAction,
    fullWidth,
    className,
    ...rest
}: InputProps) {
    const inputId = id ?? React.useId();
    const helperId = helperText ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;

    return (
        <div className={clsx(styles.field, fullWidth && styles.fullWidth, className)}>

        <div className={clsx(styles.control, error && styles.hasError, rest.disabled && 'is-disabled')}>
            {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
            <input
            id={inputId}
            className={styles.input}
            {...(error && { 'aria-invalid': true })}
            {...([helperId, errorId].filter(Boolean).length > 0 && { 
                'aria-describedby': [helperId, errorId].filter(Boolean).join(' ') 
            })}
            {...rest}
            />
            {rightAction && <span className={styles.rightAction}>{rightAction}</span>}
        </div>

        {helperText && !error && (
            <div id={helperId} className={styles.helper}>{helperText}</div>
        )}

        {error && (
            <div id={errorId} className={styles.error}>{error}</div>
        )}
        </div>
    );
}
