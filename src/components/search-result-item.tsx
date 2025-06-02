import type { Service } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Tag, ExternalLink } from 'lucide-react';

interface SearchResultItemProps {
  service: Service;
}

export function SearchResultItem({ service }: SearchResultItemProps) {
  const domainUrl = service.domain && !service.domain.startsWith('http') ? `https://${service.domain}` : service.domain;

  return (
    <Card className="flex flex-col bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden h-full transition-all hover:shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-xl tracking-tight">{service.name}</CardTitle>
        <CardDescription className="font-body text-sm pt-1 min-h-[3.5rem] line-clamp-3">{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4 space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Globe className="mr-2 h-4 w-4 text-primary shrink-0" />
          <span className="font-medium">Domain:</span>&nbsp;<span className="truncate">{service.domain}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="mr-2 h-4 w-4 text-primary shrink-0" />
          <span className="font-medium">Type:</span>&nbsp;<span className="truncate">{service.type}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-md shadow-sm hover:shadow-md transition-shadow">
          <a href={domainUrl || service.publicUrl} target="_blank" rel="noopener noreferrer">
            Visit Service
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
