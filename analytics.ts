// Google Analytics 4 lightweight wrapper using gtag and dataLayer fallback
// Usage: track('event_name', {param: 'value'})
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  try {
    const w = window as any;
    // If GA4 gtag is available, send event
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, data || {});
      return;
    }
    // Fallback to dataLayer to avoid runtime errors and keep events buffered
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event, ...data });
  } catch {}
}

// Helper to inject GA4 script when consent/ID is available
export function initGA4(measurementId: string) {
  if (typeof window === 'undefined') return;
  const id = measurementId?.trim();
  if (!id) return;
  if (document.getElementById('ga4-script')) return;

  const s1 = document.createElement('script');
  s1.id = 'ga4-script';
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s1);

  const s2 = document.createElement('script');
  s2.id = 'ga4-init';
  s2.text = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${id}');`;
  document.head.appendChild(s2);
}
