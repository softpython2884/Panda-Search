'use client';

import { useState, type FormEvent, useEffect } from 'react';
import type { Service } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchResultItem } from '@/components/search-result-item';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Search, AlertCircle, Info } from 'lucide-react';

export function SearchContainer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    if (!searchTerm.trim()) {
      setResults([]);
      setHasSearched(true); // Mark as searched even if query is empty to show "enter query" type message or clear results
      setCurrentQuery('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentQuery(searchTerm.trim());

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Search request failed. Please try again.' }));
        throw new Error(errorData.message || 'Search request failed. Please try again.');
      }
      const data: Service[] = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (hasSearched && searchTerm.trim() === '' && currentQuery !== '') {
       setResults([]);
       setCurrentQuery('');
    }
  }, [searchTerm, hasSearched, currentQuery]);


  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 sticky top-4 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-lg border">
        <Input
          type="search"
          placeholder="Enter keywords to search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow text-base h-12 px-4 rounded-lg shadow-sm focus:ring-2 focus:ring-primary border-input"
          aria-label="Search services"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out h-12 px-6 text-base"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-0 sm:mr-2 h-5 w-5" />
          )}
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center items-center py-10 text-lg">
          <Loader2 className="h-8 w-8 mr-3 animate-spin text-primary" />
          <p className="font-semibold text-foreground">Searching for services...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-8 animate-fadeIn">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-headline">Search Error</AlertTitle>
          <AlertDescription className="font-body">{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && hasSearched && results.length === 0 && currentQuery !== '' && (
         <div className="text-center py-10 animate-fadeIn">
          <Search className="mx-auto h-16 w-16 text-muted-foreground/70 mb-4" />
          <p className="text-2xl font-headline text-foreground mb-2">No services found for "{currentQuery}"</p>
          <p className="text-muted-foreground font-body">Try a different search term or check your spelling.</p>
        </div>
      )}
      
      {!isLoading && !error && !hasSearched && results.length === 0 && (
        <div className="text-center py-10 animate-fadeIn">
          <Info className="mx-auto h-16 w-16 text-muted-foreground/70 mb-4" />
          <p className="text-2xl font-headline text-foreground mb-2">Discover PANDA Services</p>
          <p className="text-muted-foreground font-body">Enter keywords in the search bar above to find the services you need.</p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {results.map((service) => (
            <SearchResultItem key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
