'use client';

import { useState } from 'react';

interface Recommendation {
  id: number;
  name: string;
  category: string;
  description: string;
  score: number;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchRecommendations = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`http://localhost:3000/recommendations?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError('Backend bağlantı hatası. Backend çalışıyor mu?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Skora göre renk belirleme
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-gray-400';
  };

  // Skora göre progress bar genişliği
  const getScoreWidth = (score: number) => {
    return `${Math.min(score * 100, 100)}%`;
  };

  // Kategori için badge rengi
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'movie': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Bölümü */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Recommendation System
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Similarity-based content recommendations powered by AI
          </p>
          
          {/* Arama Kutusu */}
          <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Bilim kurgu, aksiyon, dram, romantik..."
              className="flex-1 px-6 py-3 rounded-xl bg-gray-800/50 backdrop-blur border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRecommendations()}
            />
            <button
              onClick={searchRecommendations}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analiz Ediliyor...
                </span>
              ) : 'Öneri Al'}
            </button>
          </div>
        </div>
      </div>

      {/* Sonuçlar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6 backdrop-blur">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Önerilenler 
                <span className="ml-2 px-2 py-1 text-sm bg-gray-800 rounded-lg">
                  {recommendations.length} sonuç
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                "{query}" için
              </p>
            </div>

            <div className="grid gap-4">
              {recommendations.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all hover:transform hover:scale-[1.02] duration-300"
                >
                  {/* Skor progress bar (arka plan) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transition-all duration-500"
                    style={{ width: getScoreWidth(item.score) }}
                  />
                  
                  <div className="relative p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Sıra numarası ve isim */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-gray-600">
                            #{index + 1}
                          </span>
                          <h3 className="text-xl font-semibold text-white">
                            {item.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-lg ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        
                        {/* Açıklama */}
                        <p className="text-gray-400 text-sm mb-3">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Skor badge */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {(item.score * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">eşleşme</div>
                      </div>
                    </div>
                    
                    {/* Skor progress bar (alt çizgi) */}
                    <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${item.score >= 0.7 ? 'bg-green-500' : item.score >= 0.4 ? 'bg-yellow-500' : 'bg-gray-500'}`}
                        style={{ width: getScoreWidth(item.score) }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && query && recommendations.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">"{query}" için öneri bulunamadı.</p>
            <p className="text-gray-500 text-sm mt-2">Farklı anahtar kelimeler deneyin</p>
          </div>
        )}

        {!loading && !query && recommendations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-400 text-lg">Bir film türü veya anahtar kelime yazın</p>
            <p className="text-gray-500 text-sm mt-2">Örn: bilim kurgu, aksiyon, dram, romantik</p>
          </div>
        )}
      </div>
    </main>
  );
}