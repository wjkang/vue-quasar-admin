<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <!-- <q-card-title>
        <p class="caption">功能管理</p>
        <q-icon slot="right" name="edit" />
      </q-card-title> -->
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="multiple" :selected.sync="selected" row-key="id" :pagination.sync="serverPagination" @request="request" :loading="loading" rows-per-page-label="每页数据" no-data-label="没有数据">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.name"  type="text" prefix="角色名称：" />&nbsp;&nbsp;
                        <q-input v-model="filter.code"  type="text" prefix="角色编码：" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">查询</q-btn>&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="add" @click="addRole">新增</q-btn>
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <template slot="top-selection" slot-scope="props">
                        <q-btn color="negative" flat round delete icon="delete" @click="delRoles" />
                    </template>
                    <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:100px">
                        <q-btn small round push glossy dense icon="edit" color="primary" @click="editRole(props.value)"></q-btn>
                        <q-btn small round push glossy dense icon="delete" color="red" @click="delRole(props.value)"></q-btn>
                    </q-td>
                </q-table>
            </q-card-main>
        </q-card>
        <q-modal v-model="editModal" maximized>
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn flat round dense @click="editModal = false" icon="reply" />
                    <q-toolbar-title>
                        编辑
                    </q-toolbar-title>
                </q-toolbar>
                <q-toolbar slot="footer">
                    <q-toolbar-title>
                    </q-toolbar-title>
                    <q-btn round @click="saveRole">保存</q-btn>
                    <q-btn round color="red" @click="editModal = false">取消</q-btn>
                </q-toolbar>

                <div class="layout-padding">
                    <q-field :count="15">
                        <q-input v-model="tempRole.name" float-label="角色名称" />
                    </q-field>
                    <q-field :count="15">
                        <q-input v-model="tempRole.code" float-label="角色编码" />
                    </q-field>
                    <q-field :count="200">
                        <q-input v-model="tempRole.description" type="textarea" :max-height="100" rows="7" float-label="角色描述" />
                    </q-field>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import {
  getRolePagedList,
  delRole,
  delRoles,
  saveRole
} from "@/service/permission/role";
export default {
  name: "role",
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
        code: ""
      },
      selected: [],
      loading: false,
      editModal: false,
      tempRole: {
        id: 0,
        name: "",
        code: "",
        description: ""
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
    async delRole(id) {
      try {
        await this.$q.dialog({
          title: "删除",
          message: "确认执行删除操作？",
          position: "right",
          ok: {
            push: true,
            label: "删除"
          },
          cancel: {
            push: true,
            color: "negative",
            label: "取消"
          }
        });
        await delRole({ id: id });
        this.$q.notify({
          type: "positive",
          message: "删除成功",
          position: "bottom-right"
        });
        this.search();
      } catch (e) {}
    },
    async delRoles() {
      try {
        await this.$q.dialog({
          title: "批量删除",
          message: "确认执行批量删除操作？",
          ok: {
            push: true,
            label: "删除"
          },
          cancel: {
            push: true,
            color: "negative",
            label: "取消"
          }
        });
        await delRoles({
          ids: JSON.stringify(
            this.selected.map(s => {
              return s.id;
            })
          )
        });
        this.$q.notify({
          type: "positive",
          message: "批量删除成功",
          position: "bottom-right"
        });
        this.selected = [];
        this.search();
      } catch (e) {}
    },
    editRole(id) {
      let editRole = this.serverData.filter(s => {
        return s.id === id;
      });
      if (editRole && editRole.length > 0) {
        this.tempRole = JSON.parse(JSON.stringify(editRole[0]));
      } else {
        return true;
      }
      this.editModal = true;
    },
    async saveRole() {
      await saveRole(this.tempRole);
      this.$q.notify({
        type: "positive",
        message: "保存成功",
        position: "bottom-right"
      });
      this.editModal = false;
      this.search();
    },
    search() {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      });
    },
    addRole() {
      this.tempRole = {};
      this.editModal = true;
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