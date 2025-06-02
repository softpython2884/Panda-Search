export interface Service {
  id: string;
  name: string;
  description: string;
  domain: string;
  type: string;
  publicUrl: string;
}

export interface User {
  id: string;
  email: string;
  password?: string; // Should not be sent to client, only used for mock comparison
  name?: string;
}
