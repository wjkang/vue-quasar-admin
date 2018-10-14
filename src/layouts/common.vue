<template>
    <q-layout :view="view">
        <q-layout-header v-model="header" :reveal="headerReveal">
            <q-toolbar :inverted="$q.theme === 'ios'">
                <q-btn flat round icon="menu" @click="left = !left" />
                <q-btn flat round :icon="shrinkMenu?'keyboard_arrow_right':'keyboard_arrow_left'" @click="shrinkMenu = !shrinkMenu" /> &nbsp;&nbsp;&nbsp;
                <fty-breadcrumbs :current-path="currentPath"></fty-breadcrumbs>

                <q-toolbar-title>

                    <!-- <span slot="subtitle">Header Subtitle</span> -->
                </q-toolbar-title>
                <a href="https://github.com/wjkang/vue-quasar-admin" class="text-white" target="_blank">
                    <q-btn flat round icon="fab fa-github"> </q-btn>
                </a>
                <router-link :to="{ name: 'requestlog'}" tag="label">
                    <q-btn flat round icon="explore">
                        <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                            {{$t('Request log')}}
                        </q-tooltip>
                    </q-btn>
                </router-link>
                <q-btn flat round icon="settings_backup_restore" @click="resetDb">
                    <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                        {{$t('Initialization Data')}}
                    </q-tooltip>
                </q-btn>
                <q-btn flat round @click="toggleFullscreen()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" />
                <q-btn flat round icon="menu" @click="right = !right" aria-label="Toggle menu on right side" />
            </q-toolbar>
            <tags-view></tags-view>
            <q-slide-transition>
                <fty-module-tabs v-show="tabsShow" :module-list="moduleList" :current-module="currentModule" @select="selectModuleTab"></fty-module-tabs>
            </q-slide-transition>
            <q-page-sticky position="top-right" :offset="[18,-18]">
                <q-btn fab-mini color="primary" text-color="white" icon="thumb_up" @click="tabsShow=!tabsShow" />
            </q-page-sticky>
        </q-layout-header>

        <q-layout-footer v-model="footer" :reveal="footerReveal">
            <q-toolbar :inverted="$q.theme === 'ios'">
                <q-btn flat round dense icon="menu" @click="left = !left" aria-label="Toggle menu on left side" />
                <q-toolbar-title>
                    Footer
                </q-toolbar-title>
                <q-btn flat round dense icon="menu" @click="right = !right" aria-label="Toggle menu on right side" />
            </q-toolbar>
        </q-layout-footer>

        <q-layout-drawer side="left" v-model="left" :overlay="leftOverlay" :behavior="leftBehavior" :breakpoint="leftBreakpoint"
                         :content-style="{width:shrinkMenu?'60px':'250px'}" content-class="bg-grey-3">

            <!-- <q-list-header>Menu</q-list-header> -->
            <q-item v-show="!shrinkMenu" style="padding:10px">
                <q-item-side :avatar="userInfo.avatar" color="primary" />
                <q-item-main>
                    <q-item-tile label>{{ userInfo.name }}</q-item-tile>
                </q-item-main>
                <q-item-side right>
                    <q-btn push round color="secondary" size="xs" icon="navigation" @click="userinfo" />
                    <q-btn push rounded color="purple" size="xs" label="exit" @click="logOut" />
                </q-item-side>
            </q-item>
            <q-item v-show="shrinkMenu" style="padding:10px">
                <q-item-side :avatar="userInfo.avatar" color="primary">
                    <q-popover anchor="top right" self="top left">
                        <q-list link style="min-width: 100px">
                            <q-list-header>{{userInfo.name}}</q-list-header>
                            <q-item>
                                <q-item-main :label="$t('User info')" @click.native="userinfo" />
                            </q-item>
                            <q-item>
                                <q-item-main :label="$t('Logout')" @click.native="logOut" />
                            </q-item>
                        </q-list>
                    </q-popover>
                </q-item-side>
            </q-item>
            <fty-menu :menu-list="menuList" :shrink="shrinkMenu"></fty-menu>

        </q-layout-drawer>

        <q-layout-drawer side="right" v-model="right" :overlay="rightOverlay" :behavior="rightBehavior" :breakpoint="rightBreakpoint"
                         :content-class="$q.theme === 'mat' ? 'bg-grey-3' : null" :content-style="{fontSize: '16px',width:'400px'}">
            <q-scroll-area class="fit">
                <q-list-header>{{$t('Layout management')}}</q-list-header>
                <div class="row no-wrap justify-center">
                    <div class="col gutter-xs q-pr-xs" style="max-width: 180px;">
                        <div>
                            <q-toggle v-model="header" label="Header" />
                        </div>
                        <div>
                            <q-toggle v-model="headerReveal" label="Header Reveal" />
                        </div>
                        <div class="q-mt-sm">
                            <q-toggle v-model="left" label="Left Drawer" />
                        </div>
                        <div>
                            <q-toggle v-model="leftOverlay" label="Left as Overlay" />
                        </div>
                    </div>
                    <div class="col gutter-xs" style="max-width: 180px;">
                        <div>
                            <q-toggle v-model="footer" label="Footer" />
                        </div>
                        <div>
                            <q-toggle v-model="footerReveal" label="Footer Reveal" />
                        </div>
                        <div class="q-mt-sm">
                            <q-toggle v-model="right" disable readonly label="Right Drawer" />
                        </div>
                        <div>
                            <q-toggle v-model="rightOverlay" label="Right as Overlay" />
                        </div>
                    </div>
                </div>

                <div class="row no-wrap justify-center q-mt-sm">
                    <div class="col gutter-xs q-pr-xs" style="max-width: 180px;">
                        <div>
                            <q-input type="number" align="right" prefix="Bkpt" placeholder="Bkpt" :value="leftBreakpoint" @change="v => leftBreakpoint = v" class="no-margin" />
                        </div>
                    </div>
                    <div class="col gutter-xs" style="max-width: 180px;">
                        <div>
                            <q-input type="number" align="right" prefix="Bkpt" placeholder="Bkpt" :value="rightBreakpoint" @change="v => rightBreakpoint = v" class="no-margin" />
                        </div>
                    </div>
                </div>
                <div class="row justify-center q-mt-lg">
                    <q-chip color="primary" square detail icon="widgets">
                        view: {{ view }}
                    </q-chip>
                </div>

                <div class="flex justify-center q-mt-lg">
                    <div style="width: 360px">
                        <div class="doc-layout-grid row justify-center">
                            <div class="doc-row-definition row flex-center no-border">
                                Header
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="orange" v-model="topleft" val="l" label="l" />
                                    <q-radio color="orange" v-model="topleft" val="h" label="h" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio v-model="topcenter" val="h" label="h" />
                                    <q-radio v-model="topcenter" val="H" label="H" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="secondary" v-model="topright" val="r" label="r" />
                                    <q-radio color="secondary" v-model="topright" val="h" label="h" />
                                </div>
                            </div>
                        </div>
                        <q-card-separator />

                        <div class="doc-layout-grid row justify-center">
                            <div class="doc-row-definition row flex-center no-border">
                                Middle
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="orange" v-model="middleleft" val="l" label="l" />
                                    <q-radio color="orange" v-model="middleleft" val="L" label="L" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio v-model="middlecenter" val="p" label="p" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="secondary" v-model="middleright" val="r" label="r" />
                                    <q-radio color="secondary" v-model="middleright" val="R" label="R" />
                                </div>
                            </div>
                        </div>
                        <q-card-separator />

                        <div class="doc-layout-grid row justify-center">
                            <div class="doc-row-definition row flex-center no-border">
                                Footer
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="orange" v-model="bottomleft" val="l" label="l" />
                                    <q-radio color="orange" v-model="bottomleft" val="f" label="f" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio v-model="bottomcenter" val="f" label="f" />
                                    <q-radio v-model="bottomcenter" val="F" label="F" />
                                </div>
                            </div>
                            <div class="col flex flex-center">
                                <div class="column group" style="max-width: 40px">
                                    <q-radio color="secondary" v-model="bottomright" val="r" label="r" />
                                    <q-radio color="secondary" v-model="bottomright" val="f" label="f" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </q-scroll-area>
        </q-layout-drawer>

        <q-page-container>
            <transition name="fade" mode="out-in">
                <keep-alive :include="cachePage">
                    <router-view />
                </keep-alive>
            </transition>
        </q-page-container>
    </q-layout>
</template>

<script>
import FtyMenu from "src/components/FtyMenu";
import FtyBreadcrumbs from "src/components/FtyBreadcrumbs";
import FtyModuleTabs from "src/components/FtyModuleTabs";
import TagsView from "./components/TagsView";
import {resetDb} from "@/service/other/resetdb"
import util from "@/libs/util";

export default {
  components: {
    FtyMenu,
    FtyBreadcrumbs,
    FtyModuleTabs,
    TagsView
  },
  data() {
    return {
      header: true,
      headerReveal: true,

      left: true,
      leftOverlay: false,
      leftBehavior: "default",
      leftBreakpoint: 992,

      shrinkMenu: false,

      right: false,
      rightOverlay: false,
      rightBehavior: "default",
      rightBreakpoint: 100,

      footer: false,
      footerReveal: true,

      topleft: "h",
      topcenter: "h",
      topright: "h",

      middleleft: "L",
      middlecenter: "p",
      middleright: "R",

      bottomleft: "f",
      bottomcenter: "f",
      bottomright: "f",

      tabsShow: true
    };
  },
  computed: {
    view() {
      let top = `${this.topleft}${this.topcenter}${this.topright}`,
        middle = `${this.middleleft}${this.middlecenter}${this.middleright}`,
        bottom = `${this.bottomleft}${this.bottomcenter}${this.bottomright}`;

      return `${top} ${middle} ${bottom}`;
    },
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    menuList() {
      return this.$store.state.app.moduleMenu;
    },
    currentPath() {
      return this.$store.state.app.currentPath;
    },
    currentModule() {
      return this.$store.state.app.currentModule;
    },
    moduleList() {
      return this.$store.state.app.moduleList;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    }
  },
  methods: {
    init() {
      util.setCurrentPath(this, this.$route.name);
      // 直接在地址栏输入，或者按刷新按钮，根据当前路由更新module
      // Enter directly in the address bar, or press the refresh button to update based on the current route module
      util.setCurrentModule(this, this.$route.name);
    },
    userinfo() {
      this.$router.push({
        name: "userinfo"
      });
    },
    logOut() {
      this.$store
        .dispatch("LogOut")
        .then(() => {
          this.$router.push({
            name: "login"
          });
        })
        .catch(ex => {});
    },
    selectModuleTab(module) {
      this.$store.dispatch("changeModule", module);
    },
    toggleFullscreen() {
      this.$q.fullscreen.toggle();
    },
    async resetDb() {
      try {
        await this.$q.dialog({
          title: this.$t("Initialization Data"),
          message: this.$t("Confirm execution") + "？",
          position: "right",
          ok: {
            push: true,
            label: this.$t("Ok")
          },
          cancel: {
            push: true,
            color: "negative",
            label: this.$t("Cancel")
          }
        });
        await resetDb();
        this.$q.notify({
          type: "positive",
          message: this.$t("successfulinitdata"),
          position: "bottom-right"
        });
      } catch (e) {}
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    $route(to) {
      util.setCurrentPath(this, to.name);
      // 直接在地址栏输入，或者按刷新按钮，根据当前路由更新module
      // Enter directly in the address bar, or press the refresh button to update based on the current route module
      util.setCurrentModule(this, this.$route.name);
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-enter {
  -webkit-animation: moveFromRight 0.5s both ease;
  animation: moveFromRight 0.5s both ease;
}
.fade-leave-to,
.fade-leave-active {
  -webkit-animation: moveToLeft 0.5s both ease;
  animation: moveToLeft 0.5s both ease;
}
@-webkit-keyframes moveToLeft {
  from {
  }
  to {
    opacity: 0.5;
    -webkit-transform: translateX(-100%);
  }
}
@keyframes moveToLeft {
  from {
  }
  to {
    opacity: 0.5;
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}
@-webkit-keyframes moveFromRight {
  from {
    opacity: 0.7;
    -webkit-transform: translateX(100%);
  }
}
@keyframes moveFromRight {
  from {
    opacity: 0.7;
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
}
</style>
