import { ptPT_account } from '@/generic/locales/pt-PT/account';
import { ptPT_component } from '@/generic/locales/pt-PT/component';
import { ptPT_dashboard } from '@/generic/locales/pt-PT/dashboard';
import { ptPT_documentation } from '@/generic/locales/pt-PT/documentation';
import { ptPT_globalTips } from '@/generic/locales/pt-PT/global/tips';
import { ptPT_guide } from '@/generic/locales/pt-PT/guide';
import { ptPT_notice } from '@/generic/locales/pt-PT/notice';
import { ptPT_permissionRole } from '@/generic/locales/pt-PT/permission/role';
import { ptPT_avatorDropMenu } from '@/generic/locales/pt-PT/user/avatorDropMenu';
import { ptPT_tagsViewDropMenu } from '@/generic/locales/pt-PT/user/tagsViewDropMenu';
import { ptPT_title } from '@/generic/locales/pt-PT/user/title';
import { ptPT_general } from '@/generic/locales/pt-PT/general';

import { ptPT_activities } from './activities';
import { ptPT_calendar } from './activities/calendar';
import { ptPT_ages } from './ages';
import { ptPT_recurrence } from './recurrence';
import { ptPT_reservation } from './reservation';
import { ptPt_suggestions } from './suggestions';

const pt_PT = {
  ...ptPT_account,
  ...ptPT_avatorDropMenu,
  ...ptPT_tagsViewDropMenu,
  ...ptPT_title,
  ...ptPT_globalTips,
  ...ptPT_permissionRole,
  ...ptPT_dashboard,
  ...ptPT_guide,
  ...ptPT_documentation,
  ...ptPT_notice,
  ...ptPT_component,
  ...ptPT_activities,
  ...ptPT_reservation,
  ...ptPt_suggestions,
  ...ptPT_ages,
  ...ptPT_recurrence,
  ...ptPT_calendar,
  ...ptPT_general,
};

export default pt_PT;
