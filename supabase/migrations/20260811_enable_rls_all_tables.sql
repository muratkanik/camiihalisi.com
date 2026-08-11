-- Enable RLS on all 15 public tables (camiihalisi.com)
ALTER TABLE "Page"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentBlock"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Translation"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "City"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CityKeyword"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Badge"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClickEvent"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PageView"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CarpetQuoteRequest"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CarpetDesignSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AiTask"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentArchive"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations"  ENABLE ROW LEVEL SECURITY;

-- Public content (anon SELECT)
CREATE POLICY "public_read_pages"        ON "Page"         FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_blocks"       ON "ContentBlock" FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_translations" ON "Translation"  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_cities"       ON "City"         FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_citykeywords" ON "CityKeyword"  FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_badges"       ON "Badge"        FOR SELECT TO anon USING (true);

-- Tracking (anon INSERT only)
CREATE POLICY "public_insert_clicks"    ON "ClickEvent" FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_insert_pageviews" ON "PageView"   FOR INSERT TO anon WITH CHECK (true);

-- Quote form (anon INSERT)
CREATE POLICY "public_insert_quotes" ON "CarpetQuoteRequest" FOR INSERT TO anon WITH CHECK (true);

-- No policies = no anon access: AiTask, ContentArchive, Setting, User, CarpetDesignSession, _prisma_migrations
