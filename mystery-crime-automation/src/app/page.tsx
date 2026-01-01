import { getStorage } from "@/lib/storage";
import { StartPipelineForm } from "@/components/start-pipeline-form";
import { PipelineRunList } from "@/components/pipeline-run-list";

export default async function Home() {
  const storage = getStorage();
  const runs = await storage.list();

  return (
    <main className="container">
      <header className="hero">
        <div>
          <p className="eyebrow">Mystery &amp; Crime Automation Studio</p>
          <h1>The Midnight Bureau</h1>
          <p className="subtitle">
            Autonomous research, scripting, narration, cinematic edit, and
            YouTube deployment for long-form investigative documentaries.
          </p>
        </div>
      </header>

      <StartPipelineForm defaultLanguage="auto" />

      <section className="history">
        <div className="section-heading">
          <h2>Production History</h2>
          <p>Track pipeline progress, download master files, and monitor KPIs.</p>
        </div>
        <PipelineRunList runs={runs} />
      </section>
    </main>
  );
}
