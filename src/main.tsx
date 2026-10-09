import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import './styles.css';

type Topic = 'All notes' | 'The bean' | 'The brew' | 'The ritual';
type Fact = { id: number; topic: Exclude<Topic, 'All notes'>; title: string; text: string; source: string; url: string; icon: 'plant' | 'cup' | 'bean' };
const facts: Fact[] = [
  { id: 1, topic: 'The bean', title: 'Your coffee started as a cherry.', text: 'Coffee beans are the seeds of a fruit, often called a coffee cherry. Inside most cherries sit two seeds. After the fruit is removed and the seeds are dried, roasting brings out the flavors we know as coffee.', source: 'National Coffee Association · What is coffee?', url: 'https://www.ncausa.org/About-Coffee/What-is-Coffee', icon: 'plant' },
  { id: 2, topic: 'The brew', title: 'A little grind makes a big difference.', text: 'Grinding exposes more of the coffee to water. Finer grounds generally extract faster, but the right size depends on your brewing method. Espresso uses a fine grind; a French press typically calls for a coarser one.', source: 'National Coffee Association · How to brew coffee', url: 'https://www.ncausa.org/About-Coffee/How-to-Brew-Coffee', icon: 'bean' },
  { id: 3, topic: 'The ritual', title: 'Freshness has a few quiet enemies.', text: 'Air, moisture, heat, and light can all affect your beans. Keep them in an opaque, airtight container at room temperature. Buying smaller amounts more often helps you enjoy coffee closer to its freshest state.', source: 'National Coffee Association · How to store coffee', url: 'https://www.ncausa.org/About-Coffee/How-to-Store-Coffee', icon: 'cup' },
  { id: 4, topic: 'The bean', title: 'Decaf still has a little caffeine.', text: 'Decaffeination removes most of the caffeine in coffee, but usually not all of it. The remaining amount varies by coffee and serving size. Decaf is a lower-caffeine option, rather than a promise of zero caffeine.', source: 'U.S. FDA · Spilling the beans on caffeine', url: 'https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much', icon: 'bean' },
  { id: 5, topic: 'The brew', title: 'Water is part of the recipe.', text: 'Water quality affects the taste of brewed coffee. If your tap water has a strong odor or taste, filtered water can help. Your water temperature and coffee-to-water ratio matter too: change one variable at a time to find what you enjoy.', source: 'National Coffee Association · How to brew coffee', url: 'https://www.ncausa.org/About-Coffee/How-to-Brew-Coffee', icon: 'cup' },
  { id: 6, topic: 'The ritual', title: 'The story begins before the first sip.', text: 'Coffee passes through many hands: growing, picking, processing, drying, milling, exporting, roasting, and brewing. The cup is the final chapter of a much longer journey, shaped by people and places along the way.', source: 'National Coffee Association · Ten steps to coffee', url: 'https://www.ncausa.org/About-Coffee/10-Steps-from-Seed-to-Cup', icon: 'plant' },
];
const chapters = [
  { title: 'Grow', short: 'A fruit. A place. A beginning.', detail: 'Coffee grows on trees and shrubs in tropical regions. Variety, climate, altitude, and farming practices all help shape its story.' },
  { title: 'Harvest', short: 'Good things take their time.', detail: 'The fruit is harvested, then processed to separate the seeds from the surrounding cherry. Different processing methods can influence the final flavor.' },
  { title: 'Roast', short: 'Where the familiar aroma begins.', detail: 'Heat transforms green coffee seeds, developing color and aromatic compounds. Roast time and temperature affect the flavor you eventually taste.' },
  { title: 'Brew', short: 'A little water. A little attention.', detail: 'Water extracts soluble compounds from ground coffee. Grind size, temperature, time, and ratio work together to shape the cup.' },
  { title: 'Enjoy', short: 'Make a small moment of it.', detail: 'Taste it slowly as it cools. You may notice different aromas, sweetness, or acidity. There is no single right tasting note—start with what you notice.' },
];
function Arrow() { return <svg className="arrow-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>; }
function Illustration({ kind = 'cup', className = '' }: { kind?: 'cup' | 'plant' | 'bean'; className?: string }) {
  return <svg className={className} viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'cup' ? <><path d="M25 62h63v35c0 24-63 24-63 0V62Zm64 5h8c24 0 19 36-9 29M15 120q42 14 84 0M44 46c-17-17 17-17 0-36m20 36c-17-17 17-17 0-36"/><ellipse cx="56" cy="62" rx="31" ry="6"/><path d="M33 79v17q2 12 16 13"/></> : kind === 'bean' ? <><ellipse cx="60" cy="72" rx="34" ry="48" transform="rotate(30 60 72)"/><path d="M80 30c-39 19 0 58-43 81M75 35c-38 27-1 52-40 71"/></> : <><path d="M57 132Q78 68 46 13M65 97Q24 101 24 68q32-1 41 29Zm-1-27Q99 73 104 42q-37 0-40 28ZM56 45Q24 43 20 16q31-1 36 29Z"/><circle cx="75" cy="110" r="10"/><circle cx="87" cy="97" r="10"/><path d="m75 106-1 8m13-22-1 8M31 76l29 17m38-44-29 17M27 23l25 17"/></>}
  </svg>;
}
function App() {
  const [topic, setTopic] = useState<Topic>('All notes');
  const [active, setActive] = useState<Fact | null>(null);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState<number[]>(() => { try { const value: unknown = JSON.parse(localStorage.getItem('coffee-notes-saved') || '[]'); return Array.isArray(value) ? value.filter((id): id is number => typeof id === 'number' && facts.some(f => f.id === id)) : []; } catch { return []; } });
  const [onlySaved, setOnlySaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const lastRandom = useRef(0);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (active) { dialog.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; } }, [active]);
  const close = () => { dialog.current?.close(); setActive(null); };
  const surprise = () => { const choices = facts.filter(f => f.id !== lastRandom.current); const next = choices[Math.floor(Math.random() * choices.length)]; lastRandom.current = next.id; setActive(next); };
  const toggleSave = (id: number) => { const next = saved.includes(id) ? saved.filter(n => n !== id) : [...saved, id]; setSaved(next); try { localStorage.setItem('coffee-notes-saved', JSON.stringify(next)); setSaveError(''); } catch { setSaveError('Saved for this visit. Your browser could not store it for next time.'); } };
  const visible = facts.filter(f => (topic === 'All notes' || f.topic === topic) && (!onlySaved || saved.includes(f.id)));
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-photo"/><div className="hero-shade"/>
      <header className="relative z-20 flex items-center justify-between border-b border-white/35 px-5 py-5 md:px-10">
        <a href="#" className="wordmark" aria-label="Coffee Notes home">Coffee Notes</a>
        <button className="mobile-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="navigation">{menu ? 'Close −' : 'Menu +'}</button>
        <nav id="navigation" className={`navigation ${menu ? 'is-open' : ''}`} aria-label="Main navigation">
          {[['The journey', '#journey'], ['Coffee notes', '#notes'], ['Our philosophy', '#about'], ['FAQ', '#faq']].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          <button className="pill" onClick={() => { setMenu(false); surprise(); }}>Surprise me <Arrow/></button>
        </nav>
      </header>
      <div className="hero-title relative z-10"><h1 id="hero-heading">A little more in every cup.</h1><p className="eyebrow mt-7">COFFEE, CURIOSITY & THE EVERYDAY RITUAL</p></div>
      <div className="hero-bottom relative z-10 flex items-end justify-between gap-8"><div className="max-w-80"><p className="mb-6 text-sm leading-relaxed md:text-base">Behind your morning cup is a world worth knowing. Discover the stories, science, and small wonders of coffee.</p><a href="#notes" className="pill">Find your first discovery <Arrow/></a></div><a href="#journey" className="scroll-cue"><span>A SLOWER SIP.<br/>A LITTLE DISCOVERY.</span><span className="scroll-circle" aria-hidden="true">↓</span></a></div>
      <span className="hero-edition">AN EVERYDAY FIELD GUIDE — VOL. 01</span>
    </section>
    <main id="main">
      <section id="journey" className="journey-section section-pad">
        <div className="reveal mx-auto max-w-3xl text-center"><Illustration className="mx-auto mb-7 h-28 w-24"/><p className="eyebrow mb-5">THERE’S A WHOLE WORLD IN THERE</p><h2>From a little seed.<br/>To your daily ritual.</h2><p className="mx-auto mt-7 max-w-md text-sm leading-relaxed opacity-85">Before the first sip, there’s a story. Of places and people.<br className="hidden md:block"/> Of patience, transformation, and a little everyday magic.</p></div>
        <div className="journey-bottom reveal"><span>GROWN WITH TIME.</span><a href="#chapters" className="round-link" aria-label="Explore the bean-to-cup journey">↓</a><span>ENJOYED IN A MOMENT.</span></div>
      </section>
      <section id="chapters" className="chapters section-pad">
        <div className="section-heading reveal"><p className="eyebrow">01 / THE JOURNEY</p><h2>Good coffee has roots.</h2><p>Five small chapters.<br/>One extraordinary everyday thing.</p></div>
        <div className="chapter-list reveal">{chapters.map((chapter, i) => <details key={chapter.title} className="chapter"><summary><span className="chapter-title"><span className="chapter-number">0{i + 1}</span>{chapter.title}</span><span className="chapter-short">{chapter.short}</span><span className="chapter-plus" aria-hidden="true">+</span></summary><div className="chapter-detail"><p>{chapter.detail}</p>{i < 4 && <a href="https://www.ncausa.org/About-Coffee/10-Steps-from-Seed-to-Cup" target="_blank" rel="noreferrer">Read about the journey <Arrow/></a>}</div></details>)}</div>
      </section>
      <section id="notes" className="notes section-pad">
        <div className="section-heading reveal"><p className="eyebrow">02 / A FEW COFFEE NOTES</p><h2>Small facts.<br/><em>Fresh perspective.</em></h2><p>A little something to think about<br/>while the kettle’s on.</p></div>
        <div className="filter-bar"><div className="flex flex-wrap gap-2" aria-label="Filter notes by topic">{(['All notes', 'The bean', 'The brew', 'The ritual'] as Topic[]).map(t => <button key={t} className={`filter ${topic === t ? 'selected' : ''}`} onClick={() => setTopic(t)} aria-pressed={topic === t}>{t}</button>)}</div><button className={`saved-filter ${onlySaved ? 'active' : ''}`} onClick={() => setOnlySaved(!onlySaved)} aria-pressed={onlySaved}>♡ Saved ({saved.length})</button></div>
        <p className="sr-only" role="status">{visible.length} notes shown</p>
        <div className="fact-grid">{visible.map(fact => <article className="fact-card" key={fact.id}><div className="flex items-center justify-between"><p className="eyebrow">{fact.topic} / 0{fact.id}</p><button className="save-button" aria-label={`${saved.includes(fact.id) ? 'Unsave' : 'Save'}: ${fact.title}`} aria-pressed={saved.includes(fact.id)} onClick={() => toggleSave(fact.id)}>{saved.includes(fact.id) ? '♥' : '♡'}</button></div><Illustration kind={fact.icon} className="fact-illustration"/><h3>{fact.title}</h3><p className="fact-excerpt">{fact.text.split('. ')[0]}.</p><button className="text-link" onClick={() => setActive(fact)}>A little more on this <Arrow/></button></article>)}</div>
        {visible.length === 0 && <div className="empty-state"><Illustration className="mx-auto mb-5 h-20"/><h3>A little room for discovery.</h3><p>{onlySaved ? 'Save a note with the heart to keep it here.' : 'Try another topic to find your next discovery.'}</p><button className="text-link mt-5" onClick={() => { setOnlySaved(false); setTopic('All notes'); }}>Explore all notes <Arrow/></button></div>}
        {saveError && <p role="status" className="mt-4 text-sm">{saveError}</p>}
        <div className="notes-bottom"><p>Follow your curiosity. See where it takes you.</p><button className="pill" onClick={surprise}>Pick a note for me <Arrow/></button></div>
      </section>
      <section id="about" className="about-section"><div className="about-copy reveal"><p className="eyebrow mb-10">03 / OUR PHILOSOPHY</p><h2>Less rush.<br/>More <em>ritual.</em></h2><p className="mt-8 max-w-sm leading-relaxed">Coffee is an everyday thing. But everyday things deserve a little wonder, too.</p><p className="mt-5 max-w-sm text-sm leading-relaxed opacity-80">Coffee Notes is a small collection of things worth knowing. No complicated jargon. Just thoughtful stories and useful knowledge, with sources to follow when your curiosity takes you further.</p><a href="#faq" className="text-link mt-9">A note on our notes <Arrow/></a></div><div className="about-art"><div className="orbit-text">TAKE YOUR TIME. THERE’S MORE TO TASTE.</div><Illustration className="about-cup"/><span className="about-art-caption">THE ORDINARY, A LITTLE MORE EXTRAORDINARY.</span></div></section>
      <section id="faq" className="faq-section section-pad"><div className="reveal"><p className="eyebrow mb-5">A LITTLE CLARITY</p><h2>Good questions.</h2></div><div className="faq-list reveal">{[
        ['Where do the facts come from?', 'Each note links to a reference from a coffee organization or public authority. Open a note to follow its source and explore the fuller context. These are introductory summaries, not a substitute for the original material.'],
        ['Do I need to know anything about coffee?', 'Only that you’re curious. Start with any note that catches your eye. We keep explanations short and introduce the ideas as we go.'],
        ['Can I save a note for later?', 'Yes. Tap the heart on a note, then use the Saved filter to find it again. Notes are saved in this browser on this device, without an account. Clearing browser storage will remove your saved collection.'],
        ['Is there one right way to enjoy coffee?', 'Your preferences are a good place to start. Understanding the basics can help you experiment, but the best everyday ritual is one you enjoy.'],
      ].map(([q, a]) => <details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
    </main>
    <footer><div className="footer-top"><a href="#" className="wordmark">Coffee Notes</a><p>For the endlessly curious.<br/>And the quietly caffeinated.</p><a href="#" className="text-link">Back to the top ↑</a></div><p className="footer-title">Stay curious. Sip slowly.</p><div className="footer-bottom"><span>© {new Date().getFullYear()} COFFEE NOTES</span><span>A LITTLE MORE IN EVERY CUP.</span><a href="#notes">EXPLORE THE NOTES <Arrow/></a></div></footer>
    <dialog aria-labelledby="dialog-title" ref={dialog} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }} className="fact-dialog">{active && <div className="dialog-content"><button className="dialog-close" onClick={close} aria-label="Close coffee note" autoFocus>×</button><p className="eyebrow">COFFEE NOTE 0{active.id} / {active.topic}</p><Illustration kind={active.icon} className="mx-auto my-7 h-28 w-24"/><h2 id="dialog-title">{active.title}</h2><p className="dialog-text">{active.text}</p><a className="source-link" href={active.url} target="_blank" rel="noreferrer">{active.source} <Arrow/></a><div className="dialog-actions"><button className="pill" onClick={surprise}>Another discovery <Arrow/></button><button className="text-link" onClick={() => toggleSave(active.id)}>{saved.includes(active.id) ? '♥ Saved' : '♡ Save note'}</button></div></div>}</dialog>
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
