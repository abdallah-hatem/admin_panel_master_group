import { enUS_account } from '@/generic/locales/en-US/account';
import { enUS_component } from '@/generic/locales/en-US/component';
import { enUS_dashboard } from '@/generic/locales/en-US/dashboard';
import { enUS_globalTips } from '@/generic/locales/en-US/global/tips';
import { enUS_guide } from '@/generic/locales/en-US/guide';
import { enUS_notice } from '@/generic/locales/en-US/notice';
import { enUS_permissionRole } from '@/generic/locales/en-US/permission/role';
import { enUS_avatorDropMenu } from '@/generic/locales/en-US/user/avatorDropMenu';
import { enUS_tagsViewDropMenu } from '@/generic/locales/en-US/user/tagsViewDropMenu';
import { enUS_title } from '@/generic/locales/en-US/user/title';
import { enUs_general } from '@/generic/locales/en-US/general';

import { en_US_activities } from './activities';
import { en_US_calendar } from './activities/calendar';
import { en_US_ages } from './ages';
import { en_US_recurrence } from './recurrence';
import { en_US_reservation } from './reservation';
import { en_US_suggestions } from './suggestions';

const en_US = {
  ...enUS_account,
  ...enUS_avatorDropMenu,
  ...enUS_tagsViewDropMenu,
  ...enUS_title,
  ...enUS_globalTips,
  ...enUS_permissionRole,
  ...enUS_dashboard,
  ...enUS_guide,
  ...enUS_notice,
  ...enUs_general,
  ...en_US_activities,
  ...enUS_component,
  ...en_US_reservation,
  ...en_US_suggestions,
  ...en_US_ages,
  ...en_US_recurrence,
  ...en_US_calendar,
};

export default en_US;
