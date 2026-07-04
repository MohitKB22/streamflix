// Temporary placeholder. The real Landing Page (hero banner, animated
// backgrounds, marketing sections) is built in Phase 7 (Pages). This
// exists only so `npm run dev` has something to render right after
// `npm install` — a sanity check that the scaffold actually boots.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Netflix Clone</h1>
      <p className="text-muted-foreground">
        Scaffold is running. Folder structure + database schema (Phases 1–2) are complete —
        pages, auth, and the rest arrive in later phases.
      </p>
    </main>
  );
}
