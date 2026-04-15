#!/bin/bash
# camiihalisi.com — GitHub + Vercel deployment script
# Run this in Terminal: bash ~/camiihalisi.com/deploy.sh

set -e
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "📁 Project: $PROJECT_DIR"
echo ""

# 1. Remove stale git lock
if [ -f ".git/index.lock" ]; then
  echo "🔓 Removing stale git lock..."
  rm -f .git/index.lock
fi

# 2. Stage & commit
echo "📦 Staging all changes..."
git add -A
git status --short

echo ""
echo "💾 Committing..."
git commit -m "feat: complete Sacred Space redesign + full SEO optimization

- Emerald green/gold/cream design system (Kutsal Mekan theme)
- Navigation with glassmorphism header and UTM tracking banner
- HeroSection with 6-second slider using real mosque photos
- StatsSection, CategoryGrid, FeatureGrid, CTASection, FAQSection, BlogPreview
- Full i18n: TR/EN/AR(RTL)/FR via next-intl
- 4 product category pages with Product JSON-LD schemas
- Blog system with 5 full Turkish articles and Article JSON-LD
- sitemap.ts, robots.ts, hreflang, canonical URLs
- Organization/WebSite/BreadcrumbList JSON-LD on every page
- Prisma schema + Supabase PostgreSQL integration
- Admin panel + xAI Grok content generation API
- vercel.json targeting fra1 (Europe) region
- WCAG AA contrast enforced throughout" || echo "Nothing new to commit."

# 3. Create GitHub repo & push
echo ""
if command -v gh &> /dev/null; then
  echo "🐙 GitHub CLI detected. Creating repo..."
  # Create the repo (will error if already exists — that's fine)
  gh repo create camiihalisi.com --public --description "Cami halısı SEO sitesi — Asil Halı A.Ş." 2>/dev/null || true

  # Get current user
  GH_USER=$(gh api user --jq '.login')
  echo "   GitHub user: $GH_USER"

  # Set remote
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$GH_USER/camiihalisi.com.git"
  git branch -M main

  echo "🚀 Pushing to GitHub..."
  git push -u origin main

  echo ""
  echo "✅ GitHub: https://github.com/$GH_USER/camiihalisi.com"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔧 VERCEL BAĞLANTISI"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "1. https://vercel.com/new adresine git"
  echo "2. 'Import Git Repository' → camiihalisi.com seç"
  echo "3. Framework: Next.js (otomatik algılar)"
  echo "4. Environment Variables ekle:"
  echo "   DATABASE_URL = (Supabase pooler URL)"
  echo "   DIRECT_URL   = (Supabase direct URL)"
  echo "   XAI_API_KEY  = (xAI Grok API key)"
  echo "   NEXT_PUBLIC_SITE_URL = https://camiihalisi.com"
  echo "5. Deploy!"
  echo ""
  echo "Veya CLI ile:"
  echo "  npx vercel --prod"

else
  echo "⚠️  GitHub CLI (gh) bulunamadı."
  echo ""
  echo "Seçenek A — gh CLI yükle:"
  echo "  brew install gh"
  echo "  gh auth login"
  echo "  bash deploy.sh  # tekrar çalıştır"
  echo ""
  echo "Seçenek B — Manuel:"
  echo "  1. https://github.com/new → repo adı: camiihalisi.com"
  echo "  2. git remote add origin https://github.com/KULLANICI_ADIN/camiihalisi.com.git"
  echo "  3. git branch -M main"
  echo "  4. git push -u origin main"
fi

echo ""
echo "Done! 🎉"
