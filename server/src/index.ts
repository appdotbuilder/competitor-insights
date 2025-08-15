import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import all schemas
import {
  createCompetitorInputSchema,
  updateCompetitorInputSchema,
  startAnalysisInputSchema,
  analyzeUrlInputSchema,
  generateReportInputSchema,
} from './schema';

// Import all handlers
import { createCompetitor } from './handlers/create_competitor';
import { getCompetitors } from './handlers/get_competitors';
import { updateCompetitor } from './handlers/update_competitor';
import { startAnalysis } from './handlers/start_analysis';
import { getAnalysisSession } from './handlers/get_analysis_session';
import { getAnalysisResult } from './handlers/get_analysis_result';
import { analyzeUrl } from './handlers/analyze_url';
import { getPricingAnalysis } from './handlers/get_pricing_analysis';
import { getReviewsAnalysis } from './handlers/get_reviews_analysis';
import { getCampaignsAnalysis } from './handlers/get_campaigns_analysis';
import { generatePdfReport } from './handlers/generate_pdf_report';
import { getPdfReport } from './handlers/get_pdf_report';
import { downloadPdfReport } from './handlers/download_pdf_report';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Competitor management endpoints
  createCompetitor: publicProcedure
    .input(createCompetitorInputSchema)
    .mutation(({ input }) => createCompetitor(input)),

  getCompetitors: publicProcedure
    .query(() => getCompetitors()),

  updateCompetitor: publicProcedure
    .input(updateCompetitorInputSchema)
    .mutation(({ input }) => updateCompetitor(input)),

  // Analysis session endpoints
  startAnalysis: publicProcedure
    .input(startAnalysisInputSchema)
    .mutation(({ input }) => startAnalysis(input)),

  getAnalysisSession: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getAnalysisSession(input.sessionId)),

  getAnalysisResult: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getAnalysisResult(input.sessionId)),

  // Real-time URL analysis endpoint
  analyzeUrl: publicProcedure
    .input(analyzeUrlInputSchema)
    .mutation(({ input }) => analyzeUrl(input)),

  // Detailed analysis data endpoints
  getPricingAnalysis: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getPricingAnalysis(input.sessionId)),

  getReviewsAnalysis: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getReviewsAnalysis(input.sessionId)),

  getCampaignsAnalysis: publicProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(({ input }) => getCampaignsAnalysis(input.sessionId)),

  // PDF report generation and management
  generatePdfReport: publicProcedure
    .input(generateReportInputSchema)
    .mutation(({ input }) => generatePdfReport(input)),

  getPdfReport: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .query(({ input }) => getPdfReport(input.reportId)),

  downloadPdfReport: publicProcedure
    .input(z.object({ reportId: z.number() }))
    .query(({ input }) => downloadPdfReport(input.reportId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC Competitor Analysis API server listening at port: ${port}`);
}

start();