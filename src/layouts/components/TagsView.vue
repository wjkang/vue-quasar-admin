<template>
    <q-toolbar :inverted="$q.theme === 'ios'">
        <div style="width:100%">
            <div class="tags-view-container">
                <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
                    <q-chip ref="tag" tag square v-ripple v-for="item in tagsList" :key="item.name" :name="item.name"
                            :closable="item.name==='home_index'?false:true" :color="item.name===currentPageName?'secondary':'green-4'"
                            :class="item.name===currentPageName?'active':''" style="margin-left:4px" @hide="closePage(item.name)" @click="linkTo(item)">{{$t(item.title)}}</q-chip>
                </scroll-pane>
            </div>
        </div>
        <q-select inverted color="green-9" :placeholder="$t('Label option')" v-model="closeType" @input="tagManage" :options="[{
          label: $t('Close other'),
          value: 'other'
        },
        {
          label: $t('Close all'),
          value: 'all'
        }]" />
    </q-toolbar>
</template>

<script>
import ScrollPane from "@/components/ScrollPane";
import util from "@/libs/util.js";

export default {
  components: { ScrollPane },
  data() {
    return {
      currentPageName: this.$route.name,
      closeType: ""
    };
  },
  computed: {
    tagsList() {
      return this.$store.state.app.pageOpenedList;
    }
  },
  methods: {
    openPage(name) {
      let openpageHasTag = this.tagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    closePage(name) {
      this.$store.dispatch("closePage", name).then(pageOpenedList => {
        if (this.currentPageName === name) {
          const latestPage = pageOpenedList.slice(-1)[0];
          if (latestPage) {
            this.$router.push({ name: latestPage.name });
          } else {
            this.$router.push("/home");
          }
        }
      });
    },
    linkTo(item) {
      let routerObj = {};
      routerObj.name = item.name;
      if (item.argu) {
        routerObj.params = item.argu;
      }
      if (item.query) {
        routerObj.query = item.query;
      }
      this.$router.push(routerObj);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.$attrs.name === this.$route.name) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      });
    },
    tagManage(closeType) {
      this.$store
        .dispatch("closePages", { type: closeType, name: this.currentPageName })
        .then(pageOpenedList => {
          if (closeType === "all") {
            this.$router.push("/home");
          }
        });
      this.closeType = "";
    }
  },
  mounted() {
    this.openPage(this.$route.name);
    this.moveToCurrentTag();
  },
  watch: {
    $route(to) {
      this.openPage(this.$route.name);
      this.currentPageName = to.name;
      this.moveToCurrentTag();
    }
  }
};
</script>

<style lang="stylus" scoped>
.tags-view-container {
    .tags-view-wrapper {
        height: 34px;

        .scroll-wrapper {
            .active {
                &::after {
                    background: #0bda72;
                }
            }
        }
    }
}
</style>
