<template>
  <div style="padding:10px">
    <q-card inline class="fit shadow-6">
      <q-card-main style="height:80%">
        <q-table ref="table" color="primary" :data="serverData" :columns="columns" row-key="id" :pagination.sync="serverPagination" @request="request"
                 :loading="loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
          <template slot="top-right" slot-scope="props">
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          </template>
          <q-td slot="body-cell-createdDate" slot-scope="props" :props="props">
            {{formatDate(props.value)}}
          </q-td>
        </q-table>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { getRequestLogPagedList } from "@/service/other/requestlog";
import { date } from "quasar";
export default {
  name: "requestlog",
  data() {
    return {
      serverData: [],
      serverPagination: {
        page: 1,
        rowsNumber: 0, // specifying this determines pagination is server-side
        rowsPerPage: 10,
        descending: true // current rows per page being displayed
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
          sortable: true,
          align: "left"
        }
      ],
      loading: false
    };
  },
  methods: {
    async request(props) {
      this.loading = true;
      this.serverPagination = props.pagination;
      let table = this.$refs.table,
        { page, rowsPerPage, sortBy, descending } = props.pagination;
      let query = {
        pageIndex: page,
        pageSize: rowsPerPage,
        sortBy: sortBy,
        descending: descending
      };
      let dataRes = await getRequestLogPagedList(query);
      let data = dataRes.data.data;
      this.serverPagination.rowsNumber = data.totalCount;
      this.serverData = data.rows;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, "YYYY-MM-DD HH:mm:ss");
    }
  },

  mounted() {
    this.request({
      pagination: this.serverPagination
    });
  }
};
</script>
