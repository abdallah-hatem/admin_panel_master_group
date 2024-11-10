export type RoleStatus = 'enabled' | 'disabled';
export interface Role {
  name: {
    pt_PT: string;
    en_US: string;
    fr_FR: string;
  };
  code: string;
  id: number;
  status: RoleStatus;
}

export type GetRoleResult = Role[];
