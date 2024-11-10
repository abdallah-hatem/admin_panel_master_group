type MyPackageType = 'base' | 'custom';

type AgePrice = {
  id: number;
  clients_age_ranges_id: number;
  price: number;
  minimum_participants: number;
  maximum_participants: number;
};

type Item = {
  package_item_id: number;
  included: boolean;
};

type Itenraries = {
  id: number;
  title: string;
  _type: 'van' | 'car' | 'motorbike';
  package_id: number;
  order: number;
  day_number: number;
  start_date: string;
  end_date: string;
  latitude: number;
  longitude: number;
};

export interface PackageDto {
  id: number;
  title: string;
  description: string;
  package_type: MyPackageType;
  price: number;
  minimum_participants: number;
  maximum_participants: number;
  activity_id: number;
  items: Item[];
  ages: AgePrice[];
  date: string; // should be of type Date and formatted as '2024-04-27T10:15:30+05:30'
  itineraries: Itenraries[];
}

export const packageTypes = ['base', 'additional'];
