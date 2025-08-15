import { z } from 'zod';

// Analysis status enum
export const analysisStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);
export type AnalysisStatus = z.infer<typeof analysisStatusSchema>;

// Campaign platform enum
export const campaignPlatformSchema = z.enum(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'google_ads', 'other']);
export type CampaignPlatform = z.infer<typeof campaignPlatformSchema>;

// Competitor schema
export const competitorSchema = z.object({
  id: z.number(),
  name: z.string(),
  website_url: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type Competitor = z.infer<typeof competitorSchema>;

// Input schema for creating competitors
export const createCompetitorInputSchema = z.object({
  name: z.string().min(1, 'Competitor name is required'),
  website_url: z.string().url('Valid website URL is required'),
  description: z.string().nullable().optional(),
});
export type CreateCompetitorInput = z.infer<typeof createCompetitorInputSchema>;

// Input schema for updating competitors
export const updateCompetitorInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Competitor name is required').optional(),
  website_url: z.string().url('Valid website URL is required').optional(),
  description: z.string().nullable().optional(),
});
export type UpdateCompetitorInput = z.infer<typeof updateCompetitorInputSchema>;

// Analysis session schema
export const analysisSessionSchema = z.object({
  id: z.number(),
  competitor_id: z.number(),
  status: analysisStatusSchema,
  started_at: z.coerce.date(),
  completed_at: z.coerce.date().nullable(),
  error_message: z.string().nullable(),
});
export type AnalysisSession = z.infer<typeof analysisSessionSchema>;

// Input schema for starting analysis session
export const startAnalysisInputSchema = z.object({
  competitor_id: z.number(),
});
export type StartAnalysisInput = z.infer<typeof startAnalysisInputSchema>;

// Pricing analysis schema
export const pricingAnalysisSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  product_name: z.string(),
  price: z.number().nullable(),
  discount_percentage: z.number().nullable(),
  original_price: z.number().nullable(),
  currency: z.string(),
  pricing_model: z.string().nullable(),
  features: z.array(z.string()).nullable(),
  source_url: z.string().nullable(),
  extracted_at: z.coerce.date(),
});
export type PricingAnalysis = z.infer<typeof pricingAnalysisSchema>;

// Reviews analysis schema
export const reviewsAnalysisSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  platform: z.string(),
  overall_rating: z.number().nullable(),
  total_reviews: z.number().nullable(),
  positive_sentiment_percentage: z.number().nullable(),
  negative_sentiment_percentage: z.number().nullable(),
  neutral_sentiment_percentage: z.number().nullable(),
  recurring_themes: z.array(z.string()).nullable(),
  identified_strengths: z.array(z.string()).nullable(),
  identified_weaknesses: z.array(z.string()).nullable(),
  sample_reviews: z.array(z.object({
    text: z.string(),
    rating: z.number().nullable(),
    sentiment: z.enum(['positive', 'negative', 'neutral']),
    source: z.string().nullable(),
  })).nullable(),
  source_url: z.string().nullable(),
  analyzed_at: z.coerce.date(),
});
export type ReviewsAnalysis = z.infer<typeof reviewsAnalysisSchema>;

// Campaigns analysis schema
export const campaignsAnalysisSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  campaign_title: z.string().nullable(),
  platform: campaignPlatformSchema,
  key_messaging: z.array(z.string()).nullable(),
  campaign_duration_days: z.number().nullable(),
  start_date: z.coerce.date().nullable(),
  end_date: z.coerce.date().nullable(),
  target_audience: z.string().nullable(),
  campaign_type: z.string().nullable(),
  visual_elements: z.array(z.string()).nullable(),
  engagement_metrics: z.object({
    likes: z.number().nullable(),
    shares: z.number().nullable(),
    comments: z.number().nullable(),
    views: z.number().nullable(),
    engagement_rate: z.number().nullable(),
  }).nullable(),
  source_url: z.string().nullable(),
  discovered_at: z.coerce.date(),
});
export type CampaignsAnalysis = z.infer<typeof campaignsAnalysisSchema>;

// PDF report schema
export const pdfReportSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  file_path: z.string(),
  file_size: z.number().nullable(),
  generated_at: z.coerce.date(),
  download_count: z.number(),
});
export type PdfReport = z.infer<typeof pdfReportSchema>;

// Input schema for generating PDF report
export const generateReportInputSchema = z.object({
  session_id: z.number(),
  include_pricing: z.boolean().default(true),
  include_reviews: z.boolean().default(true),
  include_campaigns: z.boolean().default(true),
  include_visualizations: z.boolean().default(true),
});
export type GenerateReportInput = z.infer<typeof generateReportInputSchema>;

// Complete analysis result schema (for real-time insights)
export const analysisResultSchema = z.object({
  session: analysisSessionSchema,
  competitor: competitorSchema,
  pricing: z.array(pricingAnalysisSchema),
  reviews: z.array(reviewsAnalysisSchema),
  campaigns: z.array(campaignsAnalysisSchema),
  summary: z.object({
    total_products_analyzed: z.number(),
    average_price: z.number().nullable(),
    overall_sentiment_score: z.number().nullable(),
    total_campaigns_found: z.number(),
    key_insights: z.array(z.string()),
    competitive_advantages: z.array(z.string()),
    potential_weaknesses: z.array(z.string()),
  }),
});
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

// Input schema for URL analysis (for real-time processing)
export const analyzeUrlInputSchema = z.object({
  url: z.string().url('Valid URL is required'),
  competitor_name: z.string().min(1, 'Competitor name is required'),
  analysis_depth: z.enum(['basic', 'standard', 'comprehensive']).default('standard'),
});
export type AnalyzeUrlInput = z.infer<typeof analyzeUrlInputSchema>;