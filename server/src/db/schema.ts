import { serial, text, pgTable, timestamp, numeric, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enum for analysis status
export const analysisStatusEnum = pgEnum('analysis_status', ['pending', 'processing', 'completed', 'failed']);

// Enum for campaign platforms
export const campaignPlatformEnum = pgEnum('campaign_platform', ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'google_ads', 'other']);

// Main competitors table
export const competitorsTable = pgTable('competitors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  website_url: text('website_url').notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Analysis sessions table
export const analysisSessionsTable = pgTable('analysis_sessions', {
  id: serial('id').primaryKey(),
  competitor_id: integer('competitor_id').notNull().references(() => competitorsTable.id, { onDelete: 'cascade' }),
  status: analysisStatusEnum('status').default('pending').notNull(),
  started_at: timestamp('started_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
  error_message: text('error_message'),
});

// Pricing analysis table
export const pricingAnalysisTable = pgTable('pricing_analysis', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull().references(() => analysisSessionsTable.id, { onDelete: 'cascade' }),
  product_name: text('product_name').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  discount_percentage: numeric('discount_percentage', { precision: 5, scale: 2 }),
  original_price: numeric('original_price', { precision: 10, scale: 2 }),
  currency: text('currency').default('USD').notNull(),
  pricing_model: text('pricing_model'), // e.g., "subscription", "one-time", "freemium"
  features: jsonb('features'), // Array of features included
  source_url: text('source_url'),
  extracted_at: timestamp('extracted_at').defaultNow().notNull(),
});

// Customer reviews analysis table
export const reviewsAnalysisTable = pgTable('reviews_analysis', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull().references(() => analysisSessionsTable.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(), // e.g., "google", "yelp", "trustpilot", "amazon"
  overall_rating: numeric('overall_rating', { precision: 3, scale: 2 }),
  total_reviews: integer('total_reviews'),
  positive_sentiment_percentage: numeric('positive_sentiment_percentage', { precision: 5, scale: 2 }),
  negative_sentiment_percentage: numeric('negative_sentiment_percentage', { precision: 5, scale: 2 }),
  neutral_sentiment_percentage: numeric('neutral_sentiment_percentage', { precision: 5, scale: 2 }),
  recurring_themes: jsonb('recurring_themes'), // Array of common themes
  identified_strengths: jsonb('identified_strengths'), // Array of strengths
  identified_weaknesses: jsonb('identified_weaknesses'), // Array of weaknesses
  sample_reviews: jsonb('sample_reviews'), // Array of representative reviews
  source_url: text('source_url'),
  analyzed_at: timestamp('analyzed_at').defaultNow().notNull(),
});

// Campaigns analysis table
export const campaignsAnalysisTable = pgTable('campaigns_analysis', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull().references(() => analysisSessionsTable.id, { onDelete: 'cascade' }),
  campaign_title: text('campaign_title'),
  platform: campaignPlatformEnum('platform').notNull(),
  key_messaging: jsonb('key_messaging'), // Array of key messages
  campaign_duration_days: integer('campaign_duration_days'),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  target_audience: text('target_audience'),
  campaign_type: text('campaign_type'), // e.g., "product_launch", "brand_awareness", "seasonal"
  visual_elements: jsonb('visual_elements'), // Description of visual elements
  engagement_metrics: jsonb('engagement_metrics'), // If available
  source_url: text('source_url'),
  discovered_at: timestamp('discovered_at').defaultNow().notNull(),
});

// PDF reports table
export const pdfReportsTable = pgTable('pdf_reports', {
  id: serial('id').primaryKey(),
  session_id: integer('session_id').notNull().references(() => analysisSessionsTable.id, { onDelete: 'cascade' }),
  file_path: text('file_path').notNull(),
  file_size: integer('file_size'),
  generated_at: timestamp('generated_at').defaultNow().notNull(),
  download_count: integer('download_count').default(0).notNull(),
});

// TypeScript types for the table schemas
export type Competitor = typeof competitorsTable.$inferSelect;
export type NewCompetitor = typeof competitorsTable.$inferInsert;

export type AnalysisSession = typeof analysisSessionsTable.$inferSelect;
export type NewAnalysisSession = typeof analysisSessionsTable.$inferInsert;

export type PricingAnalysis = typeof pricingAnalysisTable.$inferSelect;
export type NewPricingAnalysis = typeof pricingAnalysisTable.$inferInsert;

export type ReviewsAnalysis = typeof reviewsAnalysisTable.$inferSelect;
export type NewReviewsAnalysis = typeof reviewsAnalysisTable.$inferInsert;

export type CampaignsAnalysis = typeof campaignsAnalysisTable.$inferSelect;
export type NewCampaignsAnalysis = typeof campaignsAnalysisTable.$inferInsert;

export type PdfReport = typeof pdfReportsTable.$inferSelect;
export type NewPdfReport = typeof pdfReportsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  competitors: competitorsTable,
  analysisSessions: analysisSessionsTable,
  pricingAnalysis: pricingAnalysisTable,
  reviewsAnalysis: reviewsAnalysisTable,
  campaignsAnalysis: campaignsAnalysisTable,
  pdfReports: pdfReportsTable,
};