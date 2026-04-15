-- SQL Schema for www.camiihalisi.com Dynamic CMS
-- Run this in your Supabase SQL Editor

-- 1. Create enum for component types
CREATE TYPE block_type AS ENUM ('hero', 'features', 'category_grid', 'seo_text', 'contact_form');

-- 2. Pages Table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_internal VARCHAR(255) NOT NULL, -- For admin reference
  seo_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Content Blocks (Structure of the page)
CREATE TABLE content_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_type block_type NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  -- JSON structure representing default fields
  -- e.g. {"title": "string", "image_url": "string"}
  schema_definition JSONB DEFAULT '{}'::jsonb, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Translations Table (The actual content)
-- A specific block has multiple language entries here.
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE,
  locale VARCHAR(10) NOT NULL, -- 'tr', 'en', 'ar', 'fr'
  content_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- dynamic text data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(block_id, locale)
);

-- 5. AI Task Queue (To track generation pipeline)
CREATE TABLE ai_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  target_page_slug VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, generating, translating, published, failed
  seo_score INTEGER DEFAULT 0,
  logs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some basic Initial Mock Data for root page
INSERT INTO pages (id, slug, title_internal) VALUES ('00000000-0000-0000-0000-000000000001', 'home', 'Ana Sayfa - Root');

INSERT INTO content_blocks (id, page_id, component_type, sort_order) VALUES
('00000000-0000-0000-0000-100000000001', '00000000-0000-0000-0000-000000000001', 'hero', 0);

INSERT INTO translations (block_id, locale, content_data) VALUES
('00000000-0000-0000-0000-100000000001', 'tr', '{"title": "İbadete Serilen Mükemmellik", "subtitle": "Cami Halısı Merkezi"}');
