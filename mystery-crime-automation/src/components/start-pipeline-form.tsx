"use client";

import { useState, useTransition } from "react";

interface Props {
  defaultLanguage: "auto" | "english" | "hindi" | "hinglish";
  onPipelineCreated?: (id: string) => void;
}

export function StartPipelineForm({ defaultLanguage, onPipelineCreated }: Props) {
  const [language, setLanguage] = useState(defaultLanguage);
  const [targetDuration, setTargetDuration] = useState(12);
  const [autoPublish, setAutoPublish] = useState(false);
  const [scheduleSlot, setScheduleSlot] = useState("20:00");
  const [category, setCategory] = useState<"Documentary" | "Entertainment">(
    "Documentary",
  );
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(2);
  const [preferredVoice, setPreferredVoice] = useState("alloy");
  const [forcedTopic, setForcedTopic] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setStatusMessage("Starting pipeline… this may take several minutes.");
    startTransition(async () => {
      try {
        const response = await fetch("/api/pipeline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config: {
              language,
              targetDurationMinutes: targetDuration,
              autoPublish,
              scheduleSlot: autoPublish ? scheduleSlot : undefined,
              category,
              frequencyPerWeek,
              preferredVoices: [preferredVoice],
            },
            forcedTopic: forcedTopic || undefined,
            dryRun,
          }),
        });

        if (!response.ok) {
          throw new Error("Pipeline failed to start");
        }

        const json = await response.json();
        setStatusMessage("Pipeline started successfully.");
        onPipelineCreated?.(json.run.id);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }, 1500);
      } catch (error) {
        setStatusMessage(
          (error as Error).message ??
            "Failed to start pipeline. Check server logs for details.",
        );
      }
    });
  };

  return (
    <div className="form-card">
      <h2 className="section-title">Launch New Video</h2>
      <div className="grid">
        <label>
          <span>Primary Language</span>
          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as typeof language)
            }
          >
            <option value="auto">Auto Detect</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </label>

        <label>
          <span>Duration (minutes)</span>
          <input
            type="number"
            min={8}
            max={18}
            value={targetDuration}
            onChange={(event) => setTargetDuration(Number(event.target.value))}
          />
        </label>

        <label>
          <span>Preferred Voice</span>
          <select
            value={preferredVoice}
            onChange={(event) => setPreferredVoice(event.target.value)}
          >
            <option value="alloy">Alloy (dark male)</option>
            <option value="verse">Verse (cinematic)</option>
            <option value="sol">Sol (mysterious female)</option>
          </select>
        </label>

        <label>
          <span>Frequency / week</span>
          <input
            type="number"
            min={1}
            max={7}
            value={frequencyPerWeek}
            onChange={(event) =>
              setFrequencyPerWeek(Number(event.target.value))
            }
          />
        </label>

        <label>
          <span>YouTube Category</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as typeof category)
            }
          >
            <option value="Documentary">Documentary / News</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </label>

        <label className="full-width">
          <span>Optional Forced Topic</span>
          <input
            type="text"
            placeholder="e.g. The Mysterious Death in Roopkund"
            value={forcedTopic}
            onChange={(event) => setForcedTopic(event.target.value)}
          />
        </label>
      </div>

      <div className="toggles">
        <label className="toggle">
          <input
            type="checkbox"
            checked={autoPublish}
            onChange={(event) => setAutoPublish(event.target.checked)}
          />
          <span>Auto publish to YouTube</span>
        </label>

        {autoPublish && (
          <label>
            <span>Publish at (IST)</span>
            <input
              type="time"
              value={scheduleSlot}
              onChange={(event) => setScheduleSlot(event.target.value)}
            />
          </label>
        )}

        <label className="toggle">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(event) => setDryRun(event.target.checked)}
          />
          <span>Dry run (skip YouTube upload)</span>
        </label>
      </div>

      <div className="buttons">
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="primary"
        >
          {isPending ? "Processing…" : "Generate Episode"}
        </button>
      </div>

      {statusMessage && <p className="status">{statusMessage}</p>}
    </div>
  );
}
