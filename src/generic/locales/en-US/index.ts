import { enUS_account } from './account';
import { enUs_comp } from './comp';
import { enUS_component } from './component';
import { enUS_dashboard } from './dashboard';
import { enUs_general } from './general';
import { enUS_globalTips } from './global/tips';
import { enUS_permissionRole } from './permission/role';
import { enUS_avatorDropMenu } from './user/avatorDropMenu';
import { enUS_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { enUS_title } from './user/title';
import { enUs_general as locale_general } from './general';

const en_US = {
  ...enUS_account,
  ...enUS_avatorDropMenu,
  ...enUS_tagsViewDropMenu,
  ...enUS_title,
  ...enUS_globalTips,
  ...enUS_permissionRole,
  ...enUS_dashboard,
  ...enUS_component,
  ...enUs_comp,
  ...enUs_general,
  ...locale_general,
};

export default en_US;
