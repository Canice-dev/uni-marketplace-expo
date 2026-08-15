export interface Property {
  id: string;
  category: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  mobile_number: string;
  whatsapp_number: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
}
