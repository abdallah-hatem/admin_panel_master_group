export interface ActivityDto {
  id: string;
  inserted_at: string;
  title: string;
  short_description: string;
  full_description: string;
  know_before_you_go: string;
  _type: string;
  includes_hotel_pickup: boolean;
  category_id: number;
}
