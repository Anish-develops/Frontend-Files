import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ReciprocalMatch, SkillCategory } from '../types';
import { Button } from '../components/ui/button';
import { MatchCard } from '../components/matches/MatchCard';
import { RequestSessionModal } from '../components/matches/RequestSessionModal';

interface FindMatchesPageProps {
  onViewMemberProfile: (memberId: string) => void;
}

const CATEGORIES: ('All' | SkillCategory)[] = [
  'All',
  'Design & UX',
  'Engineering & Code',
  'Languages & Writing',
  'Data & Analytics',
  'Product & Strategy',
];

export const FindMatchesPage: React.FC<FindMatchesPageProps> = ({
  onViewMemberProfile,
}) => {
  const { user } = useAuth();
  const [allMatches, setAllMatches] = useState<ReciprocalMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<ReciprocalMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Evenings' | 'Weekends'>('All');
  const [minRating, setMinRating] = useState<number>(0);

  // Request modal
  const [selectedMatch, setSelectedMatch] = useState<ReciprocalMatch | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const loadMatches = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const matches = await api.members.getMatches(user);
      setAllMatches(matches);
      setFilteredMatches(matches);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [user]);

  // Apply filters
  useEffect(() => {
    let result = [...allMatches];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.member.name.toLowerCase().includes(q) ||
          m.member.headline.toLowerCase().includes(q) ||
          m.member.teachSkills.some((s) => s.name.toLowerCase().includes(q)) ||
          m.member.learnSkills.some((s) => s.name.toLowerCase().includes(q)) ||
          m.theyTeach.some((s) => s.toLowerCase().includes(q)) ||
          m.youTeach.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (m) =>
          m.member.teachSkills.some((s) => s.category === selectedCategory) ||
          m.member.learnSkills.some((s) => s.category === selectedCategory)
      );
    }

    // Availability filter
    if (availabilityFilter !== 'All') {
      result = result.filter((m) =>
        m.member.availability.summary.toLowerCase().includes(availabilityFilter.toLowerCase())
      );
    }

    // Min rating
    if (minRating > 0) {
      result = result.filter((m) => m.member.rating >= minRating);
    }

    setFilteredMatches(result);
  }, [searchQuery, selectedCategory, availabilityFilter, minRating, allMatches]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setAvailabilityFilter('All');
    setMinRating(0);
  };

  const handleOpenRequest = (match: ReciprocalMatch) => {
    setSelectedMatch(match);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 text-white">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          Find Learning Partners
        </h1>
        <p className="text-xs sm:text-sm text-lilac-200/80 mt-1">
          Discover members with reciprocal skill alignment. Matches are ranked by mutual two-way fit.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 shadow-lifted space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-lilac-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by skill (e.g. Figma, Python, Spanish) or member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-lilac-300/20 bg-[#071322] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-flame-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="h-11 px-3 rounded-xl border border-lilac-300/20 text-xs font-bold text-white bg-[#071322] focus:outline-none focus:ring-2 focus:ring-flame-500"
            >
              <option value="All">Any Availability</option>
              <option value="Evenings">Evenings</option>
              <option value="Weekends">Weekends</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-11 px-3 rounded-xl border border-lilac-300/20 text-xs font-bold text-white bg-[#071322] focus:outline-none focus:ring-2 focus:ring-flame-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.8}>Rating: 4.8+</option>
              <option value={4.9}>Rating: 4.9+</option>
            </select>

            {(searchQuery || selectedCategory !== 'All' || availabilityFilter !== 'All' || minRating > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-11 text-xs text-lilac-200 hover:text-white font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-lilac-200/10">
          <span className="text-xs font-bold text-lilac-200/70 mr-2 uppercase tracking-wide shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-flame-gradient text-white shadow-flame'
                  : 'bg-white/5 text-lilac-100 hover:bg-white/10 hover:text-white border border-lilac-300/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-lilac-200/80 font-semibold px-1">
        <span>
          Showing <strong className="text-white">{filteredMatches.length}</strong> compatible exchange partner{filteredMatches.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5 text-flame-400 font-bold">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Ranked by reciprocal match fit</span>
        </span>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => (
            <MatchCard
              key={match.member.id}
              match={match}
              onViewProfile={onViewMemberProfile}
              onRequestExchange={handleOpenRequest}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-[#0c1e34]/90 backdrop-blur-md rounded-3xl border border-lilac-300/20 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 text-lilac-300 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No matching exchange partners found</h3>
            <p className="text-xs text-lilac-200/75 leading-relaxed">
              We couldn&apos;t find any members matching your current query or filters. Try adjusting your search term or exploring another category.
            </p>
          </div>
          <Button variant="outline" size="md" onClick={handleResetFilters} className="text-xs font-bold">
            Clear all filters
          </Button>
        </div>
      )}

      {/* Request Modal */}
      <RequestSessionModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        match={selectedMatch}
        onSuccess={loadMatches}
      />
    </div>
  );
};
