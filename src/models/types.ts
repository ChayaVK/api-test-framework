// The shapes of the data the API sends and receives. TypeScript checks every test against them.
export type Role = 'tester' | 'developer' | 'manager' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface NewUser {
  name: string;
  email: string;
  role?: Role;
  active?: boolean;
}

export interface Page<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Order {
  id: number;
  owner: string;
  productId: number;
  quantity: number;
  total: number;
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface ApiError {
  error: { code: string; message: string; details?: { field: string; message: string }[] };
  requestId?: string;
}
