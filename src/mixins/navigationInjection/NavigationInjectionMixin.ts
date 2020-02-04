import { constant, constVoid } from "fp-ts/lib/function";
import Vue, { PropType } from "vue";
import { NavigationInjection, ThemeInjection } from "../../types/AppInjection";

interface options extends Vue {
  navigation: NavigationInjection;
}

const DEFAULT_NAVIGATION_INJECTION: NavigationInjection = {
  navigationDrawerIsVisible: true,
  showNavigationDrawer: constVoid,
  hideNavigationDrawer: constVoid,
  toggleNavigationDrawer: constVoid
};

export const NavigationInjectionMixin = Vue.extend<options>().extend({
  inject: {
    navigation: {
      default: constant(DEFAULT_NAVIGATION_INJECTION)
    }
  },
  computed: {
    navigationDrawerIsVisible(): boolean {
      return this.navigation.navigationDrawerIsVisible;
    }
  },
  methods: {
    showNavigationDrawer() {
      this.navigation.showNavigationDrawer();
    },
    hideNavigationDrawer() {
      this.navigation.hideNavigationDrawer();
    },
    toggleNavigationDrawer() {
      this.navigation.toggleNavigationDrawer();
    }
  }
});
