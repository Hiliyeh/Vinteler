#!/usr/bin/env ruby
# ═══════════════════════════════════════════════════════════════════════════
# VINTELER - Générateur de Pages SEO Locales
# Génère les pages service × ville avec maillage interne
# Usage: ruby generate_pages.rb
# ═══════════════════════════════════════════════════════════════════════════

require 'yaml'
require 'fileutils'

puts "VINTELER - Generation des pages SEO"
puts "═" * 50

# Charger les données
services = YAML.load_file('_data/services.yml')
cities = YAML.load_file('_data/cities.yml')
categories = YAML.load_file('_data/categories.yml') rescue nil

# Créer le dossier pour les pages
FileUtils.mkdir_p('_services_pages')

# Vider le dossier existant (pour éviter les doublons après suppression de services)
Dir.glob('_services_pages/*.md').each { |f| File.delete(f) }

count = 0
services_by_id = services.each_with_object({}) { |s, h| h[s['id']] = s }

services.each do |service|
  cities.each do |city|
    slug = "#{service['slug_prefix']}-#{city['id']}"
    filename = "_services_pages/#{slug}.md"

    # Construire les mots-clés SEO
    keywords = []
    keywords << "#{service['slug_prefix']} #{city['name']}"
    keywords << "entreprise #{service['slug_prefix']} #{city['name']}"
    keywords << "#{service['slug_prefix']} #{city['region']}"
    keywords << "prix #{service['slug_prefix']} #{city['name']}"

    # Ajouter les mots-clés spécifiques du service
    if service['keywords']
      service['keywords'].each do |kw|
        keywords << "#{kw} #{city['name']}"
      end
    end

    # Trouver les services liés pour le maillage interne
    related_services_data = []
    if service['related_services']
      service['related_services'].each do |related_id|
        related = services_by_id[related_id]
        if related
          related_services_data << {
            'id' => related['id'],
            'name' => related['name'],
            'slug_prefix' => related['slug_prefix'],
            'short_description' => related['short_description'] || related['description'][0..100]
          }
        end
      end
    end

    # Trouver les villes proches (même région)
    nearby_cities = cities.select { |c| c['region'] == city['region'] && c['id'] != city['id'] }
                          .first(5)
                          .map { |c| { 'id' => c['id'], 'name' => c['name'] } }

    # Créer le contenu de la page avec frontmatter enrichi
    content = <<~FRONTMATTER
      ---
      layout: service-city
      title: "#{service['title']} #{city['name']}"
      description: "#{service['name']} à #{city['name']} (#{city['region']}). #{service['short_description'] || ''} Entreprise certifiée VINTELER - Devis gratuit, intervention rapide. ☎ 0490 48 92 42"

      # SEO Keywords
      keywords:
      #{keywords.first(10).map { |k| "  - \"#{k}\"" }.join("\n")}

      # URL
      slug: "#{slug}"
      permalink: "/#{slug}/"

      # Service Info
      service_id: "#{service['id']}"
      service_name: "#{service['name']}"
      service_title: "#{service['title']}"
      service_slug: "#{service['slug_prefix']}"
      service_description: "#{service['description']}"
      service_short: "#{service['short_description'] || ''}"

      # Catégorie
      category: "#{service['category']}"
      category_name: "#{service['category_name']}"

      # Ville Info
      city_name: "#{city['name']}"
      city_id: "#{city['id']}"
      region: "#{city['region']}"
      postal_codes: #{city['postal_codes'].inspect}
      #{city['is_hq'] ? "is_hq: true" : ""}

      # Geo Data (Local SEO)
      lat: #{city['lat'] || 50.8503}
      lng: #{city['lng'] || 4.3517}
      geo_region: "#{city['geo_region'] || 'BE'}"

      # Features
      features:
      #{(service['features'] || []).map { |f| "  - \"#{f}\"" }.join("\n")}

      # FAQ (pour SEO et schema FAQPage)
      #{service['faq'] && service['faq'].length > 0 ? "faq:\n" + service['faq'].map { |f| "  - question: \"#{f['question'].gsub('"', '\\"')}\"\n    answer: \"#{f['answer'].gsub('"', '\\"')}\"" }.join("\n") : ""}

      # Maillage interne - Services liés
      related_services:
      #{related_services_data.map { |rs| "  - id: \"#{rs['id']}\"\n    name: \"#{rs['name']}\"\n    slug: \"#{rs['slug_prefix']}\"\n    description: \"#{rs['short_description']}\"" }.join("\n")}

      # Villes proches (même région)
      nearby_cities:
      #{nearby_cities.map { |nc| "  - id: \"#{nc['id']}\"\n    name: \"#{nc['name']}\"" }.join("\n")}

      # Flags spéciaux
      #{service['is_emergency'] ? "is_emergency: true\nemergency_phone: \"#{service['emergency_phone']}\"\nresponse_time: \"#{service['response_time']}\"" : ""}
      featured: #{service['featured'] || false}
      priority: #{service['priority'] || 5}
      ---
    FRONTMATTER

    File.write(filename, content)
    count += 1
  end

  # Afficher la progression
  print "\r[+] #{service['name']}: #{cities.length} pages generees"
end

puts "\n"
puts "═" * 50
puts "[OK] #{count} pages SEO generees dans _services_pages/"
puts "[i] #{services.length} services x #{cities.length} villes"
puts ""
puts "Structure du maillage interne:"
puts "   - Chaque page inclut #{services.first['related_services']&.length || 0} services lies"
puts "   - Chaque page inclut les villes de la meme region"
puts ""
puts "SEO Local ameliore:"
puts "   - Coordonnees GPS (lat/lng) pour chaque ville"
puts "   - Code region ISO (geo_region) pour le ciblage geographique"
puts "   - FAQ integree pour le schema FAQPage"
puts ""
puts "Categories:"
if categories
  categories.each do |cat|
    cat_services = services.select { |s| s['category'] == cat['id'] }
    puts "   #{cat['name']}: #{cat_services.length} services"
  end
end
