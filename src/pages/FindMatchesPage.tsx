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
    <div className="space-y-6 pb-16 text-text-primary">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
          Find Learning Partners
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Discover members with reciprocal skill alignment. Matches are ranked by mutual two-way fit.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 bg-surface rounded-[14px] border border-border shadow-card space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by skill (e.g. Figma, Python, Spanish) or member name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-[9px] border border-border bg-surface text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-normal shadow-subtle"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="h-10 px-3 rounded-[9px] border border-border text-xs font-medium text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
            >
              <option value="All">Any Availability</option>
              <option value="Evenings">Evenings</option>
              <option value="Weekends">Weekends</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-10 px-3 rounded-[9px] border border-border text-xs font-medium text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-subtle"
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
                className="h-10 text-xs text-text-secondary hover:text-text-primary"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-border">
          <span className="text-xs font-medium text-text-secondary mr-1 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-[7px] text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-primary-soft text-primary-hover border-border font-semibold'
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong className="text-text-primary font-semibold">{filteredMatches.length}</strong> compatible exchange partner{filteredMatches.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5 text-success font-medium">
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
        <div className="p-10 bg-surface rounded-[14px] border border-border text-center space-y-3 max-w-lg mx-auto shadow-card">
          <div className="w-10 h-10 rounded-full bg-surface-muted text-text-secondary flex items-center justify-center mx-auto border border-border">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text-primary">No matching exchange partners found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We couldn&apos;t find any members matching your current query or filters. Try adjusting your search term or exploring another category.
            </p>
          </div>
          <Button variant="secondary" size="md" onClick={handleResetFilters} className="text-xs">
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
