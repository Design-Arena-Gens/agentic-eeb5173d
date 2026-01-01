import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStorage } from '@/lib/storage';
import { runPipeline } from '@/lib/pipeline';
import type { PipelineConfig } from '@/types/pipeline';

const PipelineConfigSchema = z.object({
  language: z.union([
    z.literal('auto'),
    z.literal('english'),
    z.literal('hindi'),
    z.literal('hinglish'),
  ]),
  targetDurationMinutes: z.number().min(8).max(20),
  autoPublish: z.boolean(),
  scheduleSlot: z.string().optional(),
  category: z.union([z.literal('Documentary'), z.literal('Entertainment')]),
  frequencyPerWeek: z.number().min(1).max(7),
  preferredVoices: z.array(z.string()).min(1).max(3),
});

const PipelineRequestSchema = z.object({
  config: PipelineConfigSchema,
  forcedTopic: z.string().optional(),
  dryRun: z.boolean().optional(),
});

export async function GET() {
  const storage = getStorage();
  const runs = await storage.list();
  return NextResponse.json({ runs });
}

export async function POST(request: Request) {
  const raw = await request.json();
  const parsed = PipelineRequestSchema.parse(raw);

  const pipelineConfig: PipelineConfig = parsed.config;
  const pipelineRun = await runPipeline({
    config: pipelineConfig,
    forcedTopic: parsed.forcedTopic,
    dryRun: parsed.dryRun,
  });

  return NextResponse.json({ run: pipelineRun }, { status: 201 });
}
