export interface PermissonsDto {
  action: string;
  value: boolean;
  description: string;
  children: PermissonsDto[];
}
