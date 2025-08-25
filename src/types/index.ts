export interface Material {
  id: string;
  numero: string;
  design: string;
  etat: 'Mauvais' | 'Bon' | 'Abîmé';
  quantite: number;
  dateCreation: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}