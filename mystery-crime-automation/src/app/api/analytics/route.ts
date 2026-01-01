import { NextResponse } from 'next/server';
import { z } from 'zod';
import { collectAnalytics } from '@/lib/pipeline/steps/analytics';

const ParamsSchema = z.object({
  videoId: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const { videoId } = ParamsSchema.parse(body);
  const analytics = await collectAnalytics(videoId);
  return NextResponse.json({ analytics });
}
