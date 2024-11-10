export interface RecurrenceDto {
  id: number;
  interval: number;
  frequency: string;
  activity_id: number;
  dtstart: string;
  dtend: string;
  until: string;
}
