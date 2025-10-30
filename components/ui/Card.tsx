import React, { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

type Padding = 'sm' | 'md' | 'lg';
type Variant = 'elevated' | 'outlined' | 'flat';

type OwnProps = {
    variant?: Variant;
    padding?: Padding;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    media?: React.ReactNode; 
    footer?: React.ReactNode;
    className?: string;
    children?: ReactNode; 
};

type PolymorphicProps<E extends ElementType> = {
    as?: E;
    } & OwnProps &
    Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | 'as' | 'children' | 'className'>;

const Card = <E extends ElementType = 'div'>(props: PolymorphicProps<E>) => {
    const {
        as,
        variant = 'elevated',
        padding = 'md',
        title,
        subtitle,
        media,
        footer,
        className,
        children,
        ...rest
    } = props as PolymorphicProps<'div'>;

    const Tag = (as || 'div') as ElementType;
    const classes = clsx(styles.card, styles[variant], styles[padding], className);

    return (
        <Tag className={classes} {...(rest as Record<string, unknown>)}>
        {media && <div className={styles.media}>{media}</div>}

        {(title || subtitle) && (
            <header className={styles.header}>
            {title && <h3 className="h3">{title}</h3>}
            {subtitle && <p className="body text-muted">{subtitle}</p>}
            </header>
        )}

        {children && <div className={styles.body}>{children}</div>}

        {footer && <footer className={styles.footer}>{footer}</footer>}
        </Tag>
    );
};

export default Card;
