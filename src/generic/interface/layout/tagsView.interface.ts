export type TagItem = {
  code: string;

  label: {
    pt_PT: string;
    en_US: string;
    fr_FR: string;
  };

  /** tag's route path */
  path: string;

  /** can be closed ? */
  closable: boolean;
};

export interface TagState {
  /** tagsView list */
  tags: TagItem[];

  /**current tagView id */
  activeTagId: TagItem['path'];
}
