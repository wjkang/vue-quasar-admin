<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <!-- <q-card-title>
        <p class="caption">功能管理</p>
        <q-icon slot="right" name="edit" />
      </q-card-title> -->
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="multiple" :selected.sync="selected" row-key="id" :pagination.sync="serverPagination" @request="request" :loading="loading" rows-per-page-label="每页数据">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.module" type="text" prefix="模块名称：" />&nbsp;&nbsp;
                        <q-input v-model="filter.name" type="text" prefix="功能名称：" />&nbsp;&nbsp;
                        <q-input v-model="filter.code" type="text" prefix="功能编码：" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">查询</q-btn>&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="add" @click="addFunction">新增</q-btn>
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <template slot="top-selection" slot-scope="props">
                        <q-btn color="negative" flat round delete icon="delete" @click="delFunctions" />
                    </template>
                    <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:100px">
                        <q-btn v-permission="['function_edit']" small round push glossy dense icon="edit" color="primary" @click="editFunction(props.value)"></q-btn>
                        <q-btn v-permission="['function_del']" small round push glossy dense icon="delete" color="red" @click="delFunction(props.value)"></q-btn>
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
                    <q-btn round @click="saveFunction">保存</q-btn>
                    <q-btn round color="red" @click="editModal = false">取消</q-btn>
                </q-toolbar>

                <div class="layout-padding">
                    <q-field :count="15">
                        <q-input v-model="tempFunction.name" float-label="功能名称" />
                    </q-field>
                    <q-field :count="15">
                        <q-input v-model="tempFunction.code" float-label="功能编码" />
                    </q-field>
                    <q-field :count="20">
                        <q-input v-model="tempFunction.description" type="textarea" :max-height="100" rows="7" float-label="功能描述" />
                    </q-field>
                    <q-chip small> {{tempFunction.module}}</q-chip>
                    <q-btn class="bg-brown-5 text-white" label="选择模块" @click="selectModule" />
                </div>
            </q-modal-layout>
        </q-modal>
        <q-modal v-model="menuModal" maximized>
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn flat round dense @click="menuModal = false" icon="reply" />
                    <q-toolbar-title>
                        选择模块
                    </q-toolbar-title>
                </q-toolbar>
                <q-toolbar slot="footer">
                    <q-toolbar-title>
                    </q-toolbar-title>
                    <q-btn round :disable="!menuSelected" @click="moduleChange">选择</q-btn>
                    <q-btn round color="red" @click="menuModal = false">取消</q-btn>
                </q-toolbar>

                <div class="layout-padding">
                    <q-tree :nodes="menuList" default-expand-all :selected.sync="menuSelected" node-key="id" />
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import {
  getFunctionPagedList,
  delFunction,
  delFunctions,
  saveFunction
} from "@/service/permission/function";
import { getAllMenu } from "@/service/system/menu";

export default {
  name: "function",
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
          name: "module",
          required: true,
          label: "模块名称",
          align: "left",
          field: "module",
          sortable: true
        },
        {
          name: "code",
          label: "功能编码",
          field: "code",
          sortable: true,
          align: "left"
        },
        {
          name: "name",
          label: "功能名称",
          field: "name",
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
        module: "",
        name: "",
        code: ""
      },
      selected: [],
      loading: false,
      editModal: false,
      menuModal: false,
      tempFunction: {
        id: 0,
        name: "",
        moduleId: 0,
        module: "",
        code: "",
        description: ""
      },
      menuList: [],
      menuSelected: 0
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
      let dataRes = await getFunctionPagedList(query);
      let data = dataRes.data.data;
      this.serverPagination.rowsNumber = data.totalCount;
      this.serverData = data.rows;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    async delFunction(id) {
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
        await delFunction({ id: id });
        this.$q.notify({
          type: "positive",
          message: "删除成功",
          position: "bottom-right"
        });
        this.search();
      } catch (e) {}
    },
    async delFunctions() {
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
        await delFunctions({
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
    editFunction(id) {
      let editFunction = this.serverData.filter(s => {
        return s.id === id;
      });
      if (editFunction && editFunction.length > 0) {
        this.tempFunction = JSON.parse(JSON.stringify(editFunction[0]));
      } else {
        return true;
      }
      this.editModal = true;
    },
    async selectModule() {
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
      this.menuSelected = this.tempFunction.moduleId || 0;
      this.menuModal = true;
    },
    findMenuById(id) {
      let menu = {};
      let _this = this;
      let getMenu = function(menuList) {
        for (var item of menuList) {
          if (item.id === id) {
            _this.editingMenu = item; //正在编辑的菜单,引用原始菜单
            menu = Object.assign({}, item);
            menu.children = null;
            break;
          } else {
            if (item.children && item.children.length > 0) {
              getMenu(item.children);
            }
          }
        }
      };
      getMenu(this.menuList);
      return menu;
    },
    moduleChange() {
      let selectMenu = this.findMenuById(this.menuSelected);
      this.tempFunction.moduleId = selectMenu.id;
      this.tempFunction.module = selectMenu.label;
      this.menuModal = false;
    },
    async saveFunction() {
      await saveFunction(this.tempFunction);
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
    addFunction() {
      this.tempFunction = {};
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