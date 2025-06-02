import { type NextRequest, NextResponse } from 'next/server';
import type { Service } from '@/types';

const PANDA_API_URL = process.env.PANDA_API_URL || 'http://localhost:9002';

interface PandaServiceResponseItem {
  id: string;
  name: string;
  description: string;
  local_url?: string; // Optional, as per example
  public_url: string;
  domain: string;
  type: string;
  created_at?: string; // Optional, as per example
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const fetchUrl = new URL(`${PANDA_API_URL}/api/search`);
  if (query && query.trim() !== '') {
    fetchUrl.searchParams.append('q', query.trim());
  }

  try {
    const apiResponse = await fetch(fetchUrl.toString(), {
      cache: 'no-store', // Ensure fresh data from the backend
    });

    if (!apiResponse.ok) {
      let errorMessage = `Error from PANDA API: ${apiResponse.status} ${apiResponse.statusText}`;
      try {
        const errorBody = await apiResponse.json();
        errorMessage = errorBody.message || errorBody.detail || errorMessage;
      } catch (e) {
        // Failed to parse error JSON
      }
      console.error(errorMessage);
      return NextResponse.json({ message: errorMessage }, { status: apiResponse.status });
    }

    const pandaServices: PandaServiceResponseItem[] = await apiResponse.json();

    // Adapt the response to the frontend's Service type
    const frontendServices: Service[] = pandaServices.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      domain: service.domain,
      type: service.type,
      publicUrl: service.public_url, // Map public_url to publicUrl
    }));

    return NextResponse.json(frontendServices);

  } catch (error) {
    console.error('Failed to fetch services from PANDA API:', error);
    let message = 'Failed to fetch services from the PANDA API.';
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
        message = `Could not connect to PANDA API at ${PANDA_API_URL}. Please ensure the PANDA server is running.`;
    } else if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
