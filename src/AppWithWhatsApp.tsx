import { useEffect, useRef, useState } from 'react';
import App, { AppFooter, WhatsAppFloatingButton } from './App';

export default function AppWithWhatsApp() {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOffsetTop, setSidebarOffsetTop] = useState(0);

  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    let rafId = 0;

    const update = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.matchMedia?.('(max-width: 900px)')?.matches;
        if (isMobile) {
          setSidebarOffsetTop(0);
          return;
        }
      }

      const previewEl = mainEl.querySelector('.preview') as HTMLElement | null;
      if (!previewEl) {
        setSidebarOffsetTop(0);
        return;
      }

      const mainRect = mainEl.getBoundingClientRect();
      const previewRect = previewEl.getBoundingClientRect();
      const offset = Math.max(0, Math.round(previewRect.top - mainRect.top));
      setSidebarOffsetTop(offset);
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    schedule();

    window.addEventListener('resize', schedule);

    const ResizeObs = (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    const ro = ResizeObs ? new ResizeObs(schedule) : null;
    if (ro) {
      ro.observe(mainEl);
      const previewEl = mainEl.querySelector('.preview') as HTMLElement | null;
      if (previewEl) ro.observe(previewEl);
    }

    return () => {
      window.removeEventListener('resize', schedule);
      if (ro) ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="layout" role="main" aria-label="Generador QR y promoción">
        <div className="layout-main" ref={mainRef}>
          <App />
        </div>
        <aside className="layout-sidebar" aria-label="Servicios" style={{ marginTop: sidebarOffsetTop }}>
          <h2 className="promo-title">Desarrollamos el software que tu empresa necesita</h2>
          <p className="promo-sub">(bien hecho desde el primer día)</p>

          <p className="promo-body">De la consultoría al desarrollo,</p>
          <p className="promo-body">acompañamos a tu empresa en cada paso.</p>

          <p className="promo-long">
            En GLASTOR diseñamos, desarrollamos e integramos soluciones digitales que resuelven problemas reales y hacen crecer tu empresa.
          </p>

          <p className="promo-long">
            Apps móviles, plataformas web y sistemas de gestión a medida: lo que tu negocio necesita, con calidad y sin demoras.
          </p>

          <p className="promo-long">
            Y como la innovación es parte de nuestro ADN, trabajamos contigo para detectar cuándo la Inteligencia Artificial aporta valor y la integramos como un
            diferencial estratégico.
          </p>

          <a
            className="promo-cta"
            href="mailto:glastor.info@gmail.com?subject=Reservar%20Asesor%C3%ADa%20Online&body=Hola%2C%20quiero%20reservar%20una%20asesor%C3%ADa%20online.%0A%0ANombre%3A%0AEmpresa%3A%0AHorario%20preferido%3A%0A"
            aria-label="Reservar Asesoría Online por email"
          >
            Reservar Asesoría Online
          </a>
        </aside>
      </div>
      <AppFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
