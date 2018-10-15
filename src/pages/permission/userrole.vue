<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" row-key="id" :pagination.sync="serverPagination" @request="request"
                         :loading="loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.name" type="text" :prefix="$t('Username') + '：'" />&nbsp;&nbsp;
                        <q-input v-model="filter.email" type="text" :prefix="$t('Email') + '：'" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">{{$t('Search')}}</q-btn>&nbsp;&nbsp;
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:150px">
                        <q-btn glossy dense color="primary" icon="edit" :label="$t('Role list')" @click="editUserRole(props)"></q-btn>
                    </q-td>
                </q-table>
            </q-card-main>
        </q-card>
        <q-modal v-model="editModal" maximized>
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn flat round dense @click="editModal = false" icon="reply" />
                    <q-toolbar-title>
                      {{$t('Edit user')}}&nbsp;
                        <q-chip small>{{userName}}</q-chip>&nbsp;{{$t('List of roles')}}
                    </q-toolbar-title>
                </q-toolbar>
                <div style="padding:20px">
                    <q-table ref="usertable" color="primary" :data="userRole.serverData" :columns="userRole.columns" row-key="id" :pagination.sync="userRole.serverPagination"
                             @request="userRoleRequest" :loading="userRole.loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
                        <template slot="top-left" slot-scope="props">
                            <q-input v-model="userRole.filter.name" type="text" :prefix="$t('Role name') + '：'" />&nbsp;&nbsp;
                            <q-input v-model="userRole.filter.code" type="text" :prefix="$t('Role code') + '：'" />&nbsp;&nbsp;
                            <q-btn push dense color="primary" icon="search" @click="searchUserRole">{{$t('Search')}}</q-btn>&nbsp;&nbsp;
                        </template>
                        <template slot="top-right" slot-scope="props">
                            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                        </template>
                        <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:100px">
                            <q-btn v-if="props.row.isAdd==2" small round push glossy dense icon="add" color="primary" @click="modifyUserRole(props.value,1)"></q-btn>
                            <q-btn v-if="props.row.isAdd==1" small round push glossy dense icon="delete" color="red" @click="modifyUserRole(props.value,0)"></q-btn>
                        </q-td>
                    </q-table>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import { getUserPagedList,editRoleUser } from "@/service/user/user";
import { getRolePagedList } from "@/service/permission/role";
export default {
  name: "userrole",
  data() {
    return {
      serverData: [],
      serverPagination: {
        page: 1,
        rowsNumber: 0, // specifying this determines pagination is server-side
        rowsPerPage: 10 // current rows per page being displayed
      },
      columns: [
        {
          name: "name",
          required: true,
          label: this.$t("Account Name"),
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "trueName",
          label: this.$t("Username"),
          field: "trueName",
          sortable: true,
          align: "left"
        },
        {
          name: "email",
          label: this.$t("Email"),
          field: "email",
          sortable: true,
          align: "left"
        },
        {
          name: "phone",
          label: this.$t("Phone"),
          field: "phone",
          sortable: true,
          align: "left"
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
        name: "",
        email: ""
      },
      loading: false,
      editModal: false,
      userId: "",
      userName: "",
      userRole: {
        serverData: [],
        serverPagination: {
          page: 1,
          rowsNumber: 0, // specifying this determines pagination is server-side
          rowsPerPage: 10 // current rows per page being displayed
        },
        columns: [
          {
            name: "name",
            required: true,
            label: this.$t("Role name"),
            align: "left",
            field: "name"
          },
          {
            name: "code",
            label: this.$t("Role code"),
            field: "code",
            align: "left"
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
          name: "",
          code: "",
          userId: ""
        },
        loading: false
      }
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
      let dataRes = await getUserPagedList(query);
      let data = dataRes.data.data;
      this.serverPagination.rowsNumber = data.totalCount;
      this.serverData = data.rows;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    editUserRole(props) {
      this.userId = props.value;
      this.userName = props.row.name;
      this.userRole.filter = {
        name: "",
        code: "",
        userId: props.value
      };
      this.editModal = true;
      this.searchUserRole();
    },
    async userRoleRequest(props) {
      this.userRole.loading = true;
      this.userRole.serverPagination = props.pagination;
      let table = this.$refs.table,
        { page, rowsPerPage, sortBy, descending } = props.pagination;
      let query = {
        pageIndex: page,
        pageSize: rowsPerPage,
        sortBy: sortBy,
        descending: descending,
        filter: this.userRole.filter
      };
      let dataRes = await getRolePagedList(query);
      let data = dataRes.data.data;
      this.userRole.serverPagination.rowsNumber = data.totalCount;
      this.userRole.serverData = data.rows;
      setTimeout(() => {
        this.userRole.loading = false;
      }, 500);
    },

    search() {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      });
    },
    searchUserRole() {
      this.userRoleRequest({
        pagination: this.userRole.serverPagination,
        filter: this.userRole.filter
      });
    },
    async modifyUserRole(roleId,action) {
      await editRoleUser({
        roleId: roleId,
        userId: this.userId,
        action: action
      });
      if (action == 1) {
        this.$q.notify({
          type: "positive",
          message: this.$t("Added successfully"),
          position: "bottom-right"
        });
      } else {
        this.$q.notify({
          type: "positive",
          message: this.$t("Successfully removed"),
          position: "bottom-right"
        });
      }
      this.searchUserRole();
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
