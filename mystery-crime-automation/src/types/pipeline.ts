export type LanguageOption = 'auto' | 'english' | 'hindi' | 'hinglish';

export interface TopicCandidate {
  id: string;
  title: string;
  description: string;
  channelTitle?: string;
  views?: number;
  publishedAt?: string;
  keywords: string[];
  relevanceScore: number;
  source: 'youtube' | 'googleTrends' | 'manual';
  metadata?: Record<string, unknown>;
}

export interface ResearchSummary {
  chosenTopic: TopicCandidate;
  alternatives: TopicCandidate[];
  rawData: Record<string, unknown>;
}

export interface ScriptSection {
  heading: string;
  content: string;
  cliffhanger?: string;
  durationSeconds: number;
}

export interface ScriptOutput {
  language: LanguageOption | 'english' | 'hindi' | 'hinglish';
  hook: string;
  sections: ScriptSection[];
  outro: string;
  totalEstimatedDuration: number;
}

export interface VoiceoverConfig {
  voiceId: string;
  pace: 'slow' | 'medium';
}

export interface VoiceoverOutput {
  audioPath: string;
  transcriptPath: string;
  durationSeconds: number;
  waveformPreview?: string;
  audioUrl?: string;
}

export interface VisualAsset {
  type: 'video' | 'image';
  path: string;
  durationSeconds?: number;
  source: 'pexels' | 'pexels-video' | 'uploaded' | 'generated';
  attribution?: string;
}

export interface VideoCompositionConfig {
  resolution: '1080p' | '4k';
  frameRate: 24 | 25 | 30;
  aspectRatio: '16:9';
  applyFilmGrain: boolean;
  applyVignette: boolean;
  applyTypewriterText: boolean;
}

export interface VideoOutput {
  videoPath: string;
  thumbnailPath: string;
  durationSeconds: number;
  storyboardImages: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  storyboardImageUrls?: string[];
}

export interface MetadataOutput {
  title: string;
  description: string;
  tags: string[];
  thumbnailPath: string;
  scheduleAt?: string;
  thumbnailUrl?: string;
}

export interface UploadOutput {
  youtubeVideoId: string;
  youtubeUrl: string;
  scheduledAt?: string;
}

export interface AnalyticsSnapshot {
  videoId: string;
  viewCount: number;
  watchTimeHours: number;
  averageViewDurationSeconds: number;
  clickThroughRate: number;
  retentionCurve?: Array<{ second: number; retentionPercent: number }>;
  updatedAt: string;
}

export type PipelineStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed';

export interface PipelineStepLog {
  step: string;
  status: PipelineStatus | 'skipped';
  message: string;
  startedAt: string;
  finishedAt?: string;
  outputSummary?: Record<string, unknown>;
}

export interface PipelineRun {
  id: string;
  status: PipelineStatus;
  createdAt: string;
  updatedAt: string;
  topic?: ResearchSummary;
  script?: ScriptOutput;
  voiceover?: VoiceoverOutput;
  visualAssets?: VisualAsset[];
  video?: VideoOutput;
  metadata?: MetadataOutput;
  upload?: UploadOutput;
  analytics?: AnalyticsSnapshot[];
  stepLogs: PipelineStepLog[];
  error?: string;
}

export interface PipelineConfig {
  language: LanguageOption;
  targetDurationMinutes: number;
  autoPublish: boolean;
  scheduleSlot?: string;
  category: 'Documentary' | 'Entertainment';
  frequencyPerWeek: number;
  preferredVoices: string[];
}

export interface PipelineRequest {
  config: PipelineConfig;
  forcedTopic?: string;
  dryRun?: boolean;
}
