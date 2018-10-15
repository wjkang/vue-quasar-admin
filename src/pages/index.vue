<template>
  <div class="row  gutter-sm" style="padding:10px">
    <div class="col">
      <q-card inline class="fit shadow-6 q-pa-md">
        <q-card-title>
          {{post.title}}
          <q-btn dense round slot="right" :icon="shrink?'keyboard_arrow_right':'keyboard_arrow_left'" @click="shrink = !shrink" />
        </q-card-title>
        <q-scroll-area style="width: 100%; height: 400px;">
          <div class="highlight">
            <code class="hljs" v-html="post.htmlContent">
            </code>
          </div>
        </q-scroll-area>
      </q-card>
    </div>
    <div class="col" v-show="shrink">
      <q-card inline class="fit shadow-6 q-pa-md">
        <q-card-title>
          {{$t('Audit log')}}
          <router-link slot="right" :to="{ name: 'requestlog'}" tag="label">
            <q-btn dense round icon="more_horiz" />
          </router-link>
        </q-card-title>
        <q-table ref="table" color="primary" :data="serverData" :columns="columns" :pagination.sync="serverPagination" hide-bottom>
          <q-td slot="body-cell-createdDate" slot-scope="props" :props="props">
            {{formatDate(props.value)}}
          </q-td>
        </q-table>
      </q-card>
    </div>
  </div>
</template>

<style>

</style>

<script>
import "highlight.js/styles/github.css";
import { getTopPostByQuery } from "@/service/cms/post";
import { getRequestLogPagedList } from "@/service/other/requestlog";
import { date } from "quasar";
export default {
  name: "home_index",
  data() {
    return {
      post: {
        htmlContent: "",
        title:"",
      },
      shrink: true,
      serverData: [],
      serverPagination: {
        rowsPerPage: 7
      },
      columns: [
        {
          name: "createdByName",
          required: true,
          label: this.$t("User"),
          align: "left",
          field: "createdByName"
        },
        {
          name: "ip",
          required: true,
          label: "IP",
          align: "left",
          field: "ip"
        },
        {
          name: "method",
          required: true,
          label: this.$t("Method"),
          align: "left",
          field: "method"
        },
        {
          name: "request",
          label: this.$t("Request"),
          field: "request",
          align: "left"
        },
        {
          name: "time",
          label: this.$t("Time (ms)"),
          field: "time",
          align: "left"
        },
        {
          name: "createdDate",
          label: this.$t("Created"),
          field: "createdDate",
          align: "left"
        }
      ]
    };
  },
  methods: {
    async init() {
      let [postRes, logRes] = await Promise.all([
        getTopPostByQuery({
          catelog: this.$t("Home notification"),
          status: 2
        }),
        getRequestLogPagedList({
          pageIndex: 1,
          pageSize: 7,
          descending: true
        })
      ]);
      if (postRes.data.data) {
        this.post.htmlContent = postRes.data.data.htmlContent;
        this.post.title=postRes.data.data.title;
      }
      this.serverData = logRes.data.data.rows;
    },
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, "YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    this.init();
  }
};
</script>
