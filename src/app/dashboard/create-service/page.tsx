// src/app/dashboard/create-service/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateServicePage() {
  return (
    <div className="space-y-6">
       <Button variant="outline" asChild className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New PANDA Service</CardTitle>
          <CardDescription>
            This is where the form to create a new service will go.
            For now, it&apos;s a placeholder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-md bg-muted/50">
            <p className="text-muted-foreground">Service Creation Form Placeholder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
