<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <!-- <q-card-title>
        <p class="caption">功能管理</p>
        <q-icon slot="right" name="edit" />
      </q-card-title> -->
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="none" row-key="id" :pagination.sync="serverPagination" @request="request" :loading="loading" rows-per-page-label="每页数据" no-data-label="没有数据">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.name" type="text" prefix="角色名称：" />&nbsp;&nbsp;
                        <q-input v-model="filter.code" type="text" prefix="角色编码：" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">查询</q-btn>&nbsp;&nbsp;
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:150px">
                        <q-btn glossy dense color="primary" icon="edit" label="用户列表" @click="editRoleUser(props)"></q-btn>
                    </q-td>
                </q-table>
            </q-card-main>
        </q-card>
        <q-modal v-model="editModal" maximized>
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn flat round dense @click="editModal = false" icon="reply" />
                    <q-toolbar-title>
                        编辑角色&nbsp;
                        <q-chip small>{{roleName}}</q-chip>&nbsp;下的用户
                    </q-toolbar-title>
                </q-toolbar>
                <div style="padding:20px">
                    <q-table ref="usertable" color="primary" :data="roleUser.serverData" :columns="roleUser.columns" row-key="id" :pagination.sync="roleUser.serverPagination" @request="roleUserRequest" :loading="roleUser.loading" rows-per-page-label="每页数据" no-data-label="没有数据">
                        <template slot="top-left" slot-scope="props">
                            <q-input v-model="roleUser.filter.name" type="text" prefix="用户名称：" />&nbsp;&nbsp;
                            <q-input v-model="roleUser.filter.email" type="text" prefix="用户邮箱：" />&nbsp;&nbsp;
                            <q-btn push dense color="primary" icon="search" @click="searchRoleUser">查询</q-btn>&nbsp;&nbsp;
                        </template>
                        <template slot="top-right" slot-scope="props">
                            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                        </template>
                        <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:100px">
                            <q-btn v-if="props.row.isAdd==2" small round push glossy dense icon="add" color="primary" @click="modifyRoleUser(props.value,1)"></q-btn>
                            <q-btn v-if="props.row.isAdd==1" small round push glossy dense icon="delete" color="red" @click="modifyRoleUser(props.value,0)"></q-btn>
                        </q-td>
                    </q-table>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import { getRolePagedList } from "@/service/permission/role";
import { getUserPagedList, editRoleUser } from "@/service/user/user";
export default {
  name: "roleuser",
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
          label: "角色名称",
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "code",
          label: "角色编码",
          field: "code",
          sortable: true,
          align: "left",
        },
        {
          name: "id",
          required: true,
          label: "操作",
          align: "left",
          field: "id"
        }
      ],
      filter: {
        name: "",
        code: ""
      },
      loading: false,
      editModal: false,
      roleId: 0,
      roleName: "",
      roleUser: {
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
            label: "账号名称",
            align: "left",
            field: "name"
          },
          {
            name: "trueName",
            label: "用户名称",
            field: "trueName",
            align: "left"
          },
          {
            name: "email",
            label: "邮箱",
            field: "email",
            align: "left"
          },
          {
            name: "phone",
            label: "Phone",
            field: "phone",
            align: "left"
          },
          {
            name: "id",
            required: true,
            label: "操作",
            align: "left",
            field: "id"
          }
        ],
        filter: {
          name: "",
          email: "",
          roleId: ""
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
      let dataRes = await getRolePagedList(query);
      let data = dataRes.data.data;
      this.serverPagination.rowsNumber = data.totalCount;
      this.serverData = data.rows;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    editRoleUser(props) {
      this.roleId = props.value;
      this.roleName = props.row.name;
      this.roleUser.filter = {
        name: "",
        email: "",
        roleId: props.value
      };
      this.editModal = true;
      this.searchRoleUser();
    },
    async roleUserRequest(props) {
      this.roleUser.loading = true;
      this.roleUser.serverPagination = props.pagination;
      let table = this.$refs.usertable,
        { page, rowsPerPage, sortBy, descending } = props.pagination;
      let query = {
        pageIndex: page,
        pageSize: rowsPerPage,
        sortBy: sortBy,
        descending: descending,
        filter: this.roleUser.filter
      };
      let dataRes = await getUserPagedList(query);
      let data = dataRes.data.data;
      this.roleUser.serverPagination.rowsNumber = data.totalCount;
      this.roleUser.serverData = data.rows;
      setTimeout(() => {
        this.roleUser.loading = false;
      }, 500);
    },
    search() {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      });
    },
    searchRoleUser() {
      this.roleUserRequest({
        pagination: this.roleUser.serverPagination,
        filter: this.roleUser.filter
      });
    },
    async modifyRoleUser(userId, action) {
      await editRoleUser({
        roleId: this.roleId,
        userId: userId,
        action: action
      });
      if (action == 1) {
        this.$q.notify({
          type: "positive",
          message: "添加成功",
          position: "bottom-right"
        });
      } else {
        this.$q.notify({
          type: "positive",
          message: "移除成功",
          position: "bottom-right"
        });
      }
      this.searchRoleUser();
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