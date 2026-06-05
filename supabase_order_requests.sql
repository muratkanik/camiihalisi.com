-- Sipariş Talepleri Tablosu
-- Renk simülatöründen gelen siparişleri kaydeder
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

CREATE TABLE IF NOT EXISTS order_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pattern_name VARCHAR(255) NOT NULL,
  color_changes JSONB NOT NULL DEFAULT '[]'::jsonb,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  locale VARCHAR(10) DEFAULT 'tr',
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from website visitors)
CREATE POLICY "Allow anonymous inserts" ON order_requests
  FOR INSERT WITH CHECK (true);

-- Allow authenticated reads (for admin panel)
CREATE POLICY "Allow authenticated reads" ON order_requests
  FOR SELECT USING (true);

-- Indexes for admin listing
CREATE INDEX idx_order_requests_created_at ON order_requests(created_at DESC);
CREATE INDEX idx_order_requests_status ON order_requests(status);
