"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import GriffinMascot from '@/components/GriffinMascot';
import { track } from '@/lib/analytics';

export default function RuLanding() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ctaMode, setCtaMode] = useState<'waitlist' | 'signup'>('waitlist');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Locomotive Scroll lazy import to avoid SSR issues
    let loco: any;
    const r = (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      loco = new LocomotiveScroll({ el: containerRef.current!, smooth: true, smartphone: { smooth: true } });
    })();
    return () => { (async () => (await r, loco?.destroy?.()))(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get('email') as string)?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Пожалуйста, введите корректный email.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }), headers: { 'Content-Type': 'application/json' } });
      const json = await res.json();
      if (json.ok) {
        track('waitlist_joined');
        setStatus('success');
        setMessage('Спасибо! Мы свяжемся с вами.');
        form.reset();
      } else {
        setStatus('error');
        setMessage(json.error === 'Rate limited' ? 'Слишком много запросов. Попробуйте позже.' : 'Проверьте email и попробуйте снова.');
      }
    } catch {
      setStatus('error');
      setMessage('Ошибка сети. Попробуйте позже.');
    }
  };

  return (
    <div ref={containerRef} data-scroll-container>
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold tracking-tight text-white">CodeGryphon</div>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setCtaMode(m => (m === 'waitlist' ? 'signup' : 'waitlist'))} className="text-white/70 hover:text-white">CTA: {ctaMode}</button>
            <a href="#cta" className="px-4 py-2 rounded-md bg-griffin-blue hover:bg-blue-600">Начать</a>
          </div>
        </div>
      </header>

      <main>
        <Section id="hero" className="pt-20">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                CodeGryphon — ассистент, который доводит задачи до результата
              </h1>
              <p className="mt-4 text-white/80 text-lg">
                В отличие от помощников уровня автодополнения, CodeGryphon берёт на себя аналитику, реализацию и QA.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="#story" className="px-5 py-3 rounded-md bg-white text-black font-semibold">Смотреть демо</a>
                <a href="#cta" className="px-5 py-3 rounded-md bg-griffin-blue">Попробовать бесплатно</a>
              </div>
            </div>
            <div className="flex justify-center">
              <GriffinMascot className="w-72 h-72" />
            </div>
          </div>
        </Section>

        <Section id="proof">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Завершает фичи, а не фрагменты', d: 'Понимает репозиторий и создаёт PR с многофайловыми изменениями.' },
              { t: 'Аналитика и QA', d: 'Пишет тест‑кейсы, предлагает проверки производительности и типобезопасности.' },
              { t: 'Безопасность', d: 'Находит секреты и уязвимости, подсказывает исправления.' },
            ].map((c) => (
              <motion.div key={c.t} whileHover={{ y: -6 }} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="font-semibold text-xl">{c.t}</h3>
                <p className="text-white/70 mt-2">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="story" className="relative">
          <div className="prose prose-invert max-w-none">
            <h2>Как это работает</h2>
          </div>
          <div className="mt-6 grid md:grid-cols-4 gap-4">
            {[
              { n: 'Задача из Jira', d: 'Парсинг, план, оценка рисков.' },
              { n: 'Изменения в коде', d: 'Многофайловые диффы, миграции.' },
              { n: 'Проверки', d: 'Тесты, безопасность, производительность.' },
              { n: 'PR и доки', d: 'Описание, чек‑листы, релиз‑ноты.' },
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-xl bg-gradient-to-br from-griffin-blue/20 to-griffin-cyan/20 border border-white/10">
                <div className="text-sm text-white/60">Глава {i + 1}</div>
                <div className="font-semibold text-lg">{s.n}</div>
                <div className="text-white/80 mt-2">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section id="roadmap">
          <h2 className="text-3xl font-bold">Дорожная карта</h2>
          <ul className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { q: 'Q4', t: 'Плагин‑SDK и мульти‑репо оркестрация' },
              { q: 'Q1', t: 'Самовосстанавливающиеся рефакторинги' },
              { q: 'Q2', t: 'Governance, SSO, аудиты' },
            ].map((r) => (
              <li key={r.t} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/60">{r.q}</div>
                <div className="font-semibold">{r.t}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="cta" className="pb-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3ш font-bold">Присоединяйтесь к раннему доступу</h2>
              <p className="text-white/70 mt-2">Получайте обновления и доступ к закрытым демо.</p>
              {ctaMode === 'waitlist' ? (
                <form onSubmit={handleSubmit} className="mt-4 flex gap-3" aria-live="polite">
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-md bg-white/5 border border-white/10 focus:outline-none"/>
                  <button disabled={status==='loading'} className="px-5 py-3 rounded-md bg-griffin-blue disabled:opacity-60">{status==='loading'?'Отправка...':'В список'}</button>
                </form>
              ) : (
                <a href="/signup" className="mt-4 inline-block px-5 py-3 rounded-md bg-griffin-blue">Зарегистрироваться</a>
              )}
              {message && (
                <div className={`mt-3 text-sm ${status==='success'?'text-green-400':'text-red-400'}`}>{message}</div>
              )}
            </div>
            <div className="flex justify-center">
              <GriffinMascot className="w-56 h-56" />
            </div>
          </div>
        </Section>
      </main>

      <footer className="py-10 border-t border-white/10 text-sm text-white/60">
        <div className="container mx-auto px-6 flex justify-between">
          <div>© {new Date().getFullYear()} CodeGryphon</div>
          <div className="space-x-4">
            <a href="#">Конфиденциальность</a>
            <a href="#">Условия</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
