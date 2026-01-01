"use client";

import { useMemo } from "react";
import type { PipelineRun } from "@/types/pipeline";

interface Props {
  runs: PipelineRun[];
}

function statusColor(status: PipelineRun["status"]) {
  switch (status) {
    case "completed":
      return "badge badge-success";
    case "failed":
      return "badge badge-danger";
    case "running":
      return "badge badge-warning";
    default:
      return "badge";
  }
}

export function PipelineRunList({ runs }: Props) {
  const orderedRuns = useMemo(
    () =>
      [...runs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [runs],
  );

  if (orderedRuns.length === 0) {
    return (
      <div className="empty-state">
        <p>No videos generated yet. Launch your first investigation above.</p>
      </div>
    );
  }

  return (
    <div className="run-grid">
      {orderedRuns.map((run) => (
        <article key={run.id} className="run-card">
          <header>
            <span className={statusColor(run.status)}>{run.status}</span>
            <h3>{run.topic?.chosenTopic.title ?? "Untitled Mystery"}</h3>
            <time dateTime={run.createdAt}>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(run.createdAt))}
            </time>
          </header>

          <section className="steps">
            {run.stepLogs.map((log) => (
              <div key={`${run.id}-${log.step}`} className="step-item">
                <span className={`dot dot-${log.status}`} />
                <div>
                  <p className="step-name">{log.step}</p>
                  <p className="step-message">{log.message}</p>
                </div>
              </div>
            ))}
          </section>

          {run.video?.videoUrl && (
            <footer>
              <a
                className="cta"
                href={run.video.videoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download Final Video
              </a>
              {run.metadata?.thumbnailUrl && (
                <a
                  className="cta secondary"
                  href={run.metadata.thumbnailUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Thumbnail
                </a>
              )}
              {run.upload?.youtubeUrl && (
                <a
                  className="cta"
                  href={run.upload.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on YouTube
                </a>
              )}
            </footer>
          )}
        </article>
      ))}
    </div>
  );
}
