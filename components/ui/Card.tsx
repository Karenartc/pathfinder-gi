import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

type Padding = 'sm' | 'md' | 'lg';
type Variant = 'elevated' | 'outlined' | 'flat';

type OwnProps = {
    variant?: Variant;
    padding?: Padding;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
};

type PolymorphicProps<E extends ElementType> = {
    as?: E;
    } & OwnProps &
    Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | 'as' | 'children' | 'className'> & {
        children?: React.ReactNode;
    };

type CardComponent = <E extends ElementType = 'div'>(props: PolymorphicProps<E>) => React.ReactElement | null;

const Card: CardComponent = (props) => {
const {
    as,
    variant = 'elevated',
    padding = 'md',
    title,
    subtitle,
    className,
    children,
    ...rest
  } = props as PolymorphicProps<'div'>; // default shape for internal usage

    const Tag = (as || 'div') as ElementType;

    const classes = clsx(styles.card, styles[variant], styles[padding], className);

    return (
        <Tag className={classes} {...(rest as Record<string, unknown>)}>
        {(title || subtitle) && (
            <header className={styles.header}>
            {title && <h3 className="h3">{title}</h3>}
            {subtitle && <p className="body text-muted">{subtitle}</p>}
            </header>
        )}
        {children}
        </Tag>
    );
};

export default Card;