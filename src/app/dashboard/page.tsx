// src/app/dashboard/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import type { Service } from '@/types'; // Assuming Service type is defined
import Link from 'next/link';
import { PlusCircle, Settings, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

// Mock data for user's services - replace with actual data fetching later
const mockServices: (Service & { isActive: boolean })[] = [
  { id: 'service1', name: 'My Cool App', description: 'A very cool application for doing cool things.', domain: 'cool-app.panda.local', type: 'WebApp', publicUrl: 'https://cool-app.panda.local', isActive: true },
  { id: 'service2', name: 'Data API', description: 'Provides critical data for other services.', domain: 'data-api.panda.local', type: 'API', publicUrl: 'https://data-api.panda.local', isActive: true },
  { id: 'service3', name: 'Legacy System', description: 'Old system, needs to be migrated.', domain: 'legacy.internal', type: 'Internal', publicUrl: 'http://legacy.internal', isActive: false },
  { id: 'service4', name: 'Blog Platform', description: 'Personal blog site.', domain: 'myblog.panda.dev', type: 'Website', publicUrl: 'https://myblog.panda.dev', isActive: true },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-8">
      <div className="pb-2 mb-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email || 'PANDA User'}!</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <PlusCircle className="mr-3 h-7 w-7 text-primary" />
              Create New Service
            </CardTitle>
            <CardDescription>
              Start a new project or deploy an existing application.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/create-service">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Service
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Settings className="mr-3 h-7 w-7 text-primary" />
              Manage Servers
            </CardTitle>
            <CardDescription>
              Access the PANDA server management console.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <a href="http://localhost:9005" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Go to Management
              </a>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">Your Services ({mockServices.length})</h2>
        {mockServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockServices.map((service) => (
              <Card key={service.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 h-8">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  <p><span className="font-medium">Domain:</span> {service.domain}</p>
                  <p><span className="font-medium">Type:</span> {service.type}</p>
                  <div className={`flex items-center ${service.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {service.isActive ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                    <span>{service.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </CardContent>
                <CardFooter>
                   <Button size="sm" variant="outline" className="w-full" asChild>
                     <a href={service.publicUrl.startsWith('http') ? service.publicUrl : `https://${service.publicUrl}`} target="_blank" rel="noopener noreferrer">
                        View Service <ExternalLink className="ml-2 h-3 w-3"/>
                     </a>
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-card">
            <p className="text-muted-foreground">You don&apos;t have any services yet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/create-service">Create Your First Service</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
