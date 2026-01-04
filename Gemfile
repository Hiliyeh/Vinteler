source "https://rubygems.org"

# Jekyll sans live reload (pas besoin d'eventmachine)
gem "jekyll", "~> 4.3"
gem "webrick"

# Plugins
group :jekyll_plugins do
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# Ignorer em-websocket pour éviter eventmachine
# Live reload n'est pas nécessaire - GitHub Pages build automatiquement
