import './navigation-drawer.sass';
import { identity, pipe } from 'fp-ts/lib/function';
import { exists } from 'fp-ts/lib/Option';
import {
	NavigationDrawerController,
	useNavigationDrawerController
} from '../../composables/navigationDrawerController';
import { useThemePropsDefinition, useTheme } from '../../composables/theme';
import { useWindowSize } from '../../composables/windowSize';
import { SlideRightTransition } from '../../transitions/slideRightTransition';
import {
	defineComponent,
	SetupContext,
	VNode,
	h,
	PropType,
	computed,
	watchEffect,
	watch,
	toRef,
	ExtractPropTypes,
	withDirectives,
	vShow
} from 'vue';
import BOverlay from '../overlay/BOverlay';
import { NavigationDrawerThemeMap } from './theme';

export const BNavigationDrawerPropsDefinition = {
	...useThemePropsDefinition(NavigationDrawerThemeMap),
	tag: {
		type: String as PropType<string>,
		default: 'nav'
	},
	isFullheight: {
		type: Boolean as PropType<boolean>,
		default: true
	},
	currentRoute: {
		type: Object as PropType<object>,
		required: false
	}
};

export type BNavigationDrawerProps = ExtractPropTypes<typeof BNavigationDrawerPropsDefinition>;

function generateDrawer(
	props: BNavigationDrawerProps,
	controller: NavigationDrawerController,
	themeClasses: string[],
	context: SetupContext
): VNode {
  return h(
    props.tag,
    {
      class: ['b-navigation-drawer', { 'is-fullheight': props.isFullheight }, ...themeClasses]
    },
    context.slots.default &&
    context.slots.default({
      showNavigationDrawer: controller.show,
      hideNavigationDrawer: controller.hide,
      navigationDrawerIsVisible: controller.isVisible.value,
      toggleNavigationDrawer: controller.toggle
    })
  );
}

function generateMobileDrawer(
	props: BNavigationDrawerProps,
	controller: NavigationDrawerController,
	themeClasses: string[],
	context: SetupContext
): VNode {
	return h(SlideRightTransition, undefined, () =>
		withDirectives(
			h(
				BOverlay,
				{
					class: 'is-left',
					isActive: pipe(controller.isVisible.value, exists(identity)),
					onClick: controller.hide
				},
				() => generateDrawer(props, controller, themeClasses, context)
			),
			[[vShow, controller.isVisible.value]]
		)
	);
}

export default defineComponent({
	name: 'b-navigation-drawer',
	props: BNavigationDrawerPropsDefinition,
	setup(props, context) {
		const controller = useNavigationDrawerController();
		const windowSize = useWindowSize();
		const { themeClasses } = useTheme(props);
		const useSideDrawer = computed(() => {
			return windowSize.value.isTouch || windowSize.value.isDesktop;
		});
		watchEffect(() => {
			useSideDrawer.value ? controller.hide() : controller.show();
		});
		watch(toRef(props, 'currentRoute'), newVal => {
			if (useSideDrawer.value) {
				controller.hide();
			}
		});
		return () => {
			if (useSideDrawer.value) {
				return generateMobileDrawer(props, controller, themeClasses.value, context);
			} else {
				return generateDrawer(props, controller, themeClasses.value, context);
			}
		};
	}
});
