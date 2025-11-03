'use client';
import React, { forwardRef } from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

type ButtonBaseProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tonal' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    className?: string;
};

type ButtonAsButton = ButtonBaseProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = ButtonBaseProps &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Spinner = () => (
    <svg className={styles.spinner} viewBox="0 0 24 24" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="10" />
        <circle className={styles.indicator} cx="12" cy="12" r="10" />
    </svg>
);

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    function Button(props, ref) {
        const {
        children,
        variant = 'primary',
        size = 'md',
        fullWidth,
        loading,
        disabled,
        startIcon,
        endIcon,
        className,
        href,
        ...rest
        } = props as any;

    const isDisabled = disabled || loading;

    const classes = clsx(
        styles.btn,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        className,
    );

    const content = (
        <>
            {loading && <Spinner />}
            {startIcon && <span className={styles.icon}>{startIcon}</span>}
            <span className={styles.label}>{children}</span>
            {endIcon && <span className={styles.icon}>{endIcon}</span>}
        </>
    );

    if (href) {
        return (
            <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={classes}
            {...(loading && { 'aria-busy': true })} // Cambio para solucionar un error.
            {...(isDisabled && { 'aria-disabled': true })} // Cambio para solucionar un error.
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            href={isDisabled ? undefined : href}
            onClick={(e) => {
                if (isDisabled) e.preventDefault();
                (rest as any)?.onClick?.(e);
            }}
            >
            {content}
            </a>
        );
    }

    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            className={classes}
            disabled={isDisabled}
            {...(loading && { 'aria-busy': true })} // Cambio para solucionar un error.
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {content}
        </button>
        );
    }
);

export default Button;