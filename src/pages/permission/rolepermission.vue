<template>
  <div style="padding:10px">
    <q-card inline class="fit shadow-6">
      <!-- <q-card-title>
        <p class="caption">功能管理</p>
        <q-icon slot="right" name="edit" />
      </q-card-title> -->
      <q-card-main style="height:80%">
        <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="none" row-key="id" :pagination.sync="serverPagination"
                 @request="request" :loading="loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
          <template slot="top-left" slot-scope="props">
            <q-input v-model="filter.name" type="text" :prefix="$t('Role name') + '：'" />&nbsp;&nbsp;
            <q-input v-model="filter.code" type="text" :prefix="$t('Role code') + '：'" />&nbsp;&nbsp;
            <q-btn push dense color="primary" icon="search" @click="search">{{$t('Search')}}</q-btn>&nbsp;&nbsp;
          </template>
          <template slot="top-right" slot-scope="props">
            <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
          </template>
          <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:200px">
            <q-btn glossy dense color="primary" icon="edit" :label="$t('Edit')" @click="editPermission(props)"></q-btn>
          </q-td>
        </q-table>
      </q-card-main>
    </q-card>
    <q-modal v-model="editModal" maximized>
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat round dense @click="editModal = false" icon="reply" />
          <q-toolbar-title>
            {{$t('Editing role')}}&nbsp;
            <q-chip small>{{roleName}}</q-chip>&nbsp;{{$t('Permission')}}
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar slot="footer">
          <q-toolbar-title>
          </q-toolbar-title>
          <q-btn round :disable="selected==0" @click="savePermission">{{$t('Save')}}</q-btn>
          <q-btn round color="red" @click="editModal = false">{{$t('Cancel')}}</q-btn>
        </q-toolbar>

        <div class="row" gutter-xs style="padding:20px">
          <div class="col-4 shadow-6 padding-10">

            <q-tree :nodes="menuList" :selected.sync="selected" node-key="id" default-expand-all />

          </div>
          <div class="col"></div>
          <div class="col-8 shadow-6">
            <q-card inline class="fit">
              <q-card-title>
                <q-chip square small>{{$t('Module function')}}</q-chip>
                <q-icon slot="right" name="edit" />
              </q-card-title>
              <q-card-main style="height:80%">
                <q-collapsible v-for="item in moduleFunctions.moduleFunctions" :key="item.id" popup :opened="item.functions.length>0" 
			:icon="item.icon" :label="item.title" :sublabel="item.name">
                  <div v-if="item.functions.length>0">
                    <q-option-group inline type="checkbox" color="primary" v-model="moduleFunctions.roleFunctions" :options="item.functions" />
                  </div>
                </q-collapsible>
              </q-card-main>
            </q-card>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import {
  getRolePagedList,
  savePermission
} from "@/service/permission/role";
import { getAllMenu, getMenuFunctions } from "@/service/system/menu";
export default {
  name: "rolepermission",
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
          label: this.$t("Role name"),
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "code",
          label: this.$t("Role code"),
          field: "code",
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
        code: ""
      },
      loading: false,
      editModal: false,
      menuList: [],
      selected: 0,
      roleId: 0,
      roleName: "",
      moduleFunctions: {
        moduleFunctions: [],
        roleFunctions: []
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
    async editPermission(props) {
      let menuListRes = await getAllMenu();
      let menuList = menuListRes.data.data;
      let reBuildMenuList = [];
      let forFn = function(menuList, newMenuList) {
        for (var item of menuList) {
          let menu = {
            id: item.id,
            parentId: item.parentId,
            label: item.title,
            name: item.name,
            path: item.path,
            icon: item.icon,
            leftMemu: item.leftMemu,
            functionCode: item.functionCode,
            isLock: item.isLock,
            sort: item.sort
          };
          menu.children = [];
          if (item.children && item.children.length > 0) {
            forFn(item.children, menu.children);
          }
          newMenuList.push(menu);
        }
      };
      forFn(menuList, reBuildMenuList);
      this.menuList = reBuildMenuList;
      this.editModal = true;
      this.roleId = props.value;
      this.roleName = props.row.name;
      this.selected = 0;
      this.moduleFunctions.moduleFunctions = [];
      this.moduleFunctions.roleFunctions = [];
    },
    search() {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      });
    },
    async getModuleFunctions(moduleId) {
      if (!moduleId) {
        return;
      }
      let moduleFunctionsRes = await getMenuFunctions({
        menuId: moduleId,
        roleId: this.roleId
      });
      this.moduleFunctions.moduleFunctions = moduleFunctionsRes.data.data.menuFunctions.map(
        s => {
          let functions = JSON.parse(
            window.JSON.stringify(s.functions)
              .replace(/name/g, "label")
              .replace(/id/g, "value")
          );
          s.functions = functions.map(n => {
            n.value = window.JSON.stringify({
              id: n.value,
              moduleId: n.moduleId
            });
            return n;
          });
          return s;
        }
      );
      this.moduleFunctions.roleFunctions = moduleFunctionsRes.data.data.roleFunctions.map(
        s => {
          return window.JSON.stringify({
              id: s.functionId,
              moduleId: s.moduleId
            });;
        }
      );
    },
    async savePermission() {
      let data = {
        roleId: this.roleId,
        permissions: this.moduleFunctions.roleFunctions,
        moduleId:this.selected
      };
      await savePermission(data);
      this.$q.notify({
        type: "positive",
        message: this.$t("Saved successfully"),
        position: "bottom-right"
      });
    }
  },
  mounted() {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
  },
  watch: {
    selected(value) {
      this.getModuleFunctions(value);
    }
  }
};
</script>
