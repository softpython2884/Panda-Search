import { type NextRequest, NextResponse } from 'next/server';
import type { Service } from '@/types';

const mockServices: Service[] = [
  { id: '1', name: 'Awesome Cloud Storage', description: 'Store all your files securely in the cloud with blazing fast access. Supports various file types and offers robust backup solutions.', domain: 'storage.example.com', type: 'Cloud Storage', publicUrl: 'https://example.com/cloud-storage' },
  { id: '2', name: 'PANDA Analytics Suite', description: 'Powerful analytics platform to understand your data. Provides deep insights, customizable dashboards, and real-time reporting.', domain: 'analytics.example.dev', type: 'Analytics Platform', publicUrl: 'https://example.com/analytics-suite' },
  { id: '3', name: 'Secure Mail Service', description: 'End-to-end encrypted email for privacy-conscious users and businesses. Features include custom domains and spam filtering.', domain: 'mail.example.org', type: 'Email Service', publicUrl: 'https://example.com/secure-mail' },
  { id: '4', name: 'PANDA Video Hosting', description: 'Host and stream your videos with our reliable and scalable platform. Supports HD streaming and content delivery network.', domain: 'videos.example.com', type: 'Video Hosting', publicUrl: 'https://example.com/video-hosting' },
  { id: '5', name: 'Code Collab PANDA', description: 'A real-time collaborative coding environment for remote teams. Integrated with version control and project management tools.', domain: 'code.example.io', type: 'Developer Tool', publicUrl: 'https://example.com/code-collab' },
  { id: '6', name: 'Global CDN PANDA', description: 'Accelerate your website and application delivery with our global Content Delivery Network. Low latency and high availability.', domain: 'cdn.example.net', type: 'CDN Service', publicUrl: 'https://example.com/cdn-panda' },
  { id: '7', name: 'PANDA Payments Gateway', description: 'Seamlessly integrate payments into your platform. Supports multiple currencies and payment methods.', domain: 'payments.example.co', type: 'Payment Gateway', publicUrl: 'https://example.com/payments' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!query || query.trim() === '') {
    return NextResponse.json([]);
  }

  const lowerCaseQuery = query.toLowerCase();
  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(lowerCaseQuery) ||
    service.description.toLowerCase().includes(lowerCaseQuery) ||
    service.type.toLowerCase().includes(lowerCaseQuery) ||
    service.domain.toLowerCase().includes(lowerCaseQuery)
  );

  return NextResponse.json(filteredServices);
}
