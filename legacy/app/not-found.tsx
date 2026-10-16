import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center bg-void">
      <div className="container-x flex flex-col gap-8">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow" />
          Error 404
        </p>
        <h1 className="display-xl text-gradient-bone">Lost frame</h1>
        <p className="body-lg max-w-[48ch]">
          This page is not part of the sequence. Head back to the start and pick up the scroll from
          there.
        </p>
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-3 rounded-full bg-bone px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-void transition-colors duration-400 hover:bg-emerald-soft"
        >
          Back to the portfolio
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
