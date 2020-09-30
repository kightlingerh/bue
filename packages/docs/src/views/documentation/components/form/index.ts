import { RouteRecordRaw } from 'vue-router';
import { BuetifyRouteMeta } from '../../../../shared/types';
import { BuetifyMenuNavigationGroup, group } from '../../shared/BuetifyMenu';
import * as autocomplete from './autocomplete';
import * as checkbox from './checkbox';
import * as datepicker from './datepicker';
import * as field from './field';
import * as input from './input';

export const meta: Record<string, BuetifyRouteMeta> = {
	[autocomplete.meta.fullPath]: autocomplete.meta,
	[checkbox.meta.fullPath]: checkbox.meta,
	[datepicker.meta.fullPath]: datepicker.meta,
	[field.meta.fullPath]: field.meta,
	[input.meta.fullPath]: input.meta
};

export const routes: RouteRecordRaw[] = [autocomplete.route, checkbox.route, datepicker.route, field.route, input.route];

export const menu: BuetifyMenuNavigationGroup = group('Form Controls', [
	autocomplete.menu,
	checkbox.menu,
	datepicker.menu,
	field.menu,
	input.menu
]);
