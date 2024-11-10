import { ptPT_account } from './account';
import { ptPT_comp } from './comp';
import { ptPT_component } from './component';
import { ptPT_dashboard } from './dashboard';
import { ptPT_general } from './general';
import { ptPT_globalTips } from './global/tips';
import { ptPT_permissionRole } from './permission/role';
import { ptPT_avatorDropMenu } from './user/avatorDropMenu';
import { ptPT_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { ptPT_title } from './user/title';

const pt_PT = {
  ...ptPT_account,
  ...ptPT_avatorDropMenu,
  ...ptPT_tagsViewDropMenu,
  ...ptPT_title,
  ...ptPT_globalTips,
  ...ptPT_permissionRole,
  ...ptPT_dashboard,
  ...ptPT_component,
  ...ptPT_comp,
  ...ptPT_general,
};

export default pt_PT;
