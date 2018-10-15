<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="multiple" :selected.sync="selected" row-key="id"
                         :pagination.sync="serverPagination" @request="request" :loading="loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.name" type="text" :prefix="$t('Title') + '：'" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">{{$t('Search')}}</q-btn>&nbsp;&nbsp;
                        <router-link :to="{ name: 'post_edit', params: { id:0 }}">
                            <q-btn push dense color="primary" icon="add">{{$t('Add')}}</q-btn>
                        </router-link>
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <template slot="top-selection" slot-scope="props">
                        <q-btn color="negative" flat round delete icon="delete" @click="delUsers" />
                    </template>

                    <q-tr slot="header" slot-scope="props">
                        <q-th auto-width>
                            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" indeterminate-value="some" />
                        </q-th>
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">
                            {{ col.label }}
                        </q-th>
                    </q-tr>
                    <template slot="body" slot-scope="props">
                        <q-tr :props="props">
                            <q-td auto-width>
                                <q-checkbox color="primary" v-model="props.selected" />
                                <q-checkbox color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
                            </q-td>
                            <q-td key="title" :props="props">
                                {{ props.row.title }}
                            </q-td>
                            <q-td key="catelog" :props="props">{{ props.row.catelog }}</q-td>
                            <q-td key="tags" :props="props">
                                <q-chip small dense color="secondary" v-for="tag in props.row.tags" :key="tag">{{tag}}</q-chip>
                            </q-td>
                            <q-td key="status" :props="props">
                                <q-chip v-if="props.row.status==1" small color="faded">{{$t('Draft')}}</q-chip>
                                <q-chip v-else-if="props.row.status==2" small color="primary">{{$t('Published')}}</q-chip>
                                <q-chip v-else-if="props.row.status==3" color="negative">{{$t('Deleted')}}</q-chip>
                            </q-td>
                            <q-td key="sort" :props="props">{{ props.row.sort }}</q-td>
                            <q-td key="publishedDate" :props="props">{{formatDate(props.row.publishedDate)}}</q-td>
                            <q-td key="createdDate" :props="props">{{formatDate(props.row.createdDate)}}</q-td>
                            <q-td key="updatedDate" :props="props">{{formatDate(props.row.updatedDate)}}</q-td>
                            <q-td key="id" :props="props">
                                <router-link :to="{ name: 'post_edit', params: { id: props.row.id }}">
                                    <q-btn small round push glossy dense icon="edit" color="primary"></q-btn>
                                </router-link>
                                <q-btn small round push glossy dense icon="delete" color="red"></q-btn>
                            </q-td>
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                                <div class="text-left">{{ props.row.shortContent }}</div>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </q-card-main>
        </q-card>
    </div>
</template>

<script>
import { getPostPagedList } from "@/service/cms/post";
import { date } from "quasar";
export default {
  name:"post",
  data() {
    return {
      serverData: [],
      serverPagination: {
        page: 1,
        rowsNumber: 0, // specifying this determines pagination is server-side
        rowsPerPage: 10, // current rows per page being displayed
        descending: true
      },
      columns: [
        {
          name: "title",
          required: true,
          label: this.$t("Title"),
          align: "left",
          field: "title",
          sortable: true
        },
        {
          name: "catelog",
          label: this.$t("Classification"),
          field: "catelog",
          sortable: true,
          align: "left"
        },
        {
          name: "tags",
          label: this.$t("Tags"),
          field: "tags",
          sortable: false,
          align: "left"
        },
        {
          name: "status",
          label: this.$t("Status"),
          field: "status",
          sortable: true,
          align: "left"
        },
        {
          name: "sort",
          required: true,
          sortable: true,
          label: this.$t("Sort"),
          align: "left",
          field: "sort"
        },
        {
          name: "publishedDate",
          required: true,
          sortable: true,
          label: this.$t("Published date"),
          align: "left",
          field: "publishedDate"
        },
        {
          name: "createdDate",
          required: true,
          sortable: true,
          label: this.$t("Created date"),
          align: "left",
          field: "createdDate"
        },
        {
          name: "updatedDate",
          required: true,
          sortable: true,
          label: this.$t("Updated date"),
          align: "left",
          field: "updatedDate"
        },
        {
          name: "id",
          required: true,
          label: this.$t("ID"),
          align: "left",
          field: "id"
        }
      ],
      filter: {
        title: "",
        catelog: "",
        tags: "",
        status: 0
      },
      selected: [],
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
        descending: descending,
        filter: this.filter
      };
      let dataRes = await getPostPagedList(query);
      let data = dataRes.data.data;
      this.serverPagination.rowsNumber = data.totalCount;
      this.serverData = data.rows;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    formatDate(timeStamp) {
      return date.formatDate(timeStamp, "YYYY-MM-DD HH:mm:ss");
    },
    search() {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      });
    }
  },
  mounted() {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
  }
};
</script>
