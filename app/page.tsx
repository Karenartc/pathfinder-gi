'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

function useDarkMode() {
  const [isDark, setIsDark] = React.useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  React.useEffect(() => {
    const html = document.documentElement;
    if (isDark) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDark]);

  return { isDark, setIsDark };
}

const IconArrowRight = (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M10 17l5-5-5-5v10z" />
  </svg>
);

const IconSearch = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />
  </svg>
);

export default function ComponentsPlaygroundPage() {
  const { isDark, setIsDark } = useDarkMode();

  return (
    <main>
      {/* HEADER */}
      <header style={{ borderBottom: 'var(--divider) as any', paddingBlock: 'var(--space-6)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-4)',
              gridTemplateColumns: '1fr',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="overline">Design System</div>
              <h1 className="display" style={{ margin: 0 }}>
                Playground de componentes
              </h1>
              <p className="subtitle" style={{ marginTop: 'var(--space-2)' }}>
                Tokens → Helpers → UI Components. Visualiza variantes, tamaños y estados en light/dark.
              </p>
            </div>

            <div style={{ display: 'inline-flex', gap: 'var(--space-3)', alignItems: 'center' }}>
              <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(e) => setIsDark(e.target.checked)}
                  aria-label="Alternar modo oscuro"
                />
                <span className="body">Modo oscuro</span>
              </label>
              <Button variant="tonal" size="sm" startIcon={IconArrowRight} onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                Ir al final
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* TOKENS RÁPIDO */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Tokens (snapshot rápido)</h2>
          <p className="body text-muted">Validación rápida de colores y tipografía.</p>

          <div style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: '1fr', marginTop: 'var(--space-4)' }}>
            <Card title="Colores semánticos" variant="outlined">
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                {[
                  { name: 'Primary', varName: '--color-primary' },
                  { name: 'On Primary', varName: '--color-on-primary' },
                  { name: 'Primary Container', varName: '--color-primary-container' },
                  { name: 'Surface', varName: '--color-surface' },
                  { name: 'On Surface', varName: '--color-on-surface' },
                  { name: 'Outline', varName: '--color-outline' },
                  { name: 'Success', varName: '--success' },
                  { name: 'Warning', varName: '--warning' },
                  { name: 'Error', varName: '--error' },
                ].map((c) => (
                  <div key={c.varName} style={{ display: 'grid', gap: 8 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        background: `rgb(var(${c.varName}))`,
                        border: 'var(--border) as any',
                      }}
                    />
                    <div className="caption">{c.name}</div>
                    <div className="caption text-muted">{c.varName}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Tipografía">
              <div style={{ display: 'grid', gap: 8 }}>
                <div className="display">Texto Display</div>
                <h1>Encabezado H1</h1>
                <h2>Encabezado H2</h2>
                <h3>Encabezado H3</h3>
                <div className="subtitle">Subtítulo / sección</div>
                <div className="body">Body (texto estándar). Lorem ipsum dolor sit amet consectetur.</div>
                <div className="body-s">Body pequeño. Ideal para labels o densidades altas.</div>
                <div className="caption">Caption / nota aclaratoria.</div>
                <div className="overline">Overline / metadatos.</div>
                <a href="#">Enlace de ejemplo</a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* BUTTONS */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Buttons</h2>
          <p className="body text-muted">Variantes, tamaños, estados y como enlace.</p>

          <div style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: '1fr', marginTop: 'var(--space-4)' }}>
            <Card title="Variantes" subtitle="primary, secondary, tonal, outline, ghost">
              <div style={{ display: 'inline-flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tonal">Tonal</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </Card>

            <Card title="Tamaños" subtitle="sm, md, lg">
              <div style={{ display: 'inline-flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card>

            <Card title="Estados" subtitle="loading y disabled">
              <div style={{ display: 'inline-flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button loading startIcon={IconArrowRight}>
                  Cargando...
                </Button>
                <Button disabled endIcon={IconArrowRight}>
                  Deshabilitado
                </Button>
              </div>
            </Card>

            <Card title="Con íconos" subtitle="startIcon / endIcon">
              <div style={{ display: 'inline-flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button startIcon={IconArrowRight}>Empezar</Button>
                <Button endIcon={IconArrowRight} variant="outline">
                  Siguiente
                </Button>
              </div>
            </Card>

            <Card title="Como enlace" subtitle='render como <a> usando href'>
              <div style={{ display: 'inline-flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="/register">Registrarse</a>
                <a href="/register">Registrarse</a>
                <a href="/login">Iniciar sesión</a>
              </div>
            </Card>

            <Card title="Full width">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <Button fullWidth>Continuar</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* INPUTS */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Inputs</h2>
          <p className="body text-muted">Label, helper, error, íconos, disabled, readOnly.</p>

          <div style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: '1fr', marginTop: 'var(--space-4)' }}>
            <Card title="Básico">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <Input label="Correo" placeholder="nombre@correo.com" helperText="Nunca compartiremos tu email." />
                <Input label="Contraseña" type="password" placeholder="••••••••" />
              </div>
            </Card>

            <Card title="Con icono y acción">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <Input
                  label="Buscar"
                  placeholder="Aulas, edificios, servicios…"
                  leftIcon={IconSearch}
                  rightAction={<Button size="sm">Buscar</Button>}
                />
              </div>
            </Card>

            <Card title="Estados">
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <Input label="Error" placeholder="Campo con error" error="Formato inválido" />
                <Input label="Deshabilitado" placeholder="No editable" disabled />
                <Input label="Solo lectura" defaultValue="Valor" readOnly />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="section">
        <div className="container">
          <h2 className="h2">Cards</h2>
        </div>

        <div className="container" style={{ marginTop: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: '1fr' }}>
            <Card title="Elevated" variant="elevated" subtitle="Con sombra">
              <p className="body">Contenido de ejemplo dentro de una Card elevada.</p>
            </Card>

            <Card title="Outlined" variant="outlined" subtitle="Con borde">
              <p className="body">Contenido de ejemplo para Card outlined.</p>
            </Card>

            <Card title="Flat" variant="flat" subtitle="Sutil">
              <p className="body">Contenido de ejemplo para Card flat.</p>
            </Card>

            <Card title="Paddings" variant="outlined">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'stretch' }}>
                <Card as="section" variant="flat" padding="sm">
                  padding=sm
                </Card>
                <Card as="section" variant="flat" padding="md">
                  padding=md
                </Card>
                <Card as="section" variant="flat" padding="lg">
                  padding=lg
                </Card>
              </div>
            </Card>

            <Card title="Card como enlace (polimórfico)" subtitle='Usando as="a" y href'>
              <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                <Card
                  as="a"
                  href="/map"
                  target="_self"
                  variant="elevated"
                  padding="md"
                  style={{ textDecoration: 'none', display:  'block' }}
                >
                  Card como enlace
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* PIE DEL PLAYGROUND */}
      <section className="section">
        <div className="container">
          <div className="divider" />
          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="caption text-muted">Fin del playground</span>
            <Button size="sm" variant="tonal" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Volver arriba
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
``