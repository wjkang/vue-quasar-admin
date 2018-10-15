<template>
    <div style="padding:10px">
        <q-card inline class="fit shadow-6">
            <q-card-main style="height:80%">
                <q-table ref="table" color="primary" :data="serverData" :columns="columns" selection="multiple" :selected.sync="selected" row-key="id"
                         :pagination.sync="serverPagination" @request="request" :loading="loading" :rows-per-page-label="$t('Rows per page')" :no-data-label="$t('No data')">
                    <template slot="top-left" slot-scope="props">
                        <q-input v-model="filter.name"  type="text" :prefix="$t('Username') + '：'" />&nbsp;&nbsp;
                        <q-input v-model="filter.email"  type="text" :prefix="$t('Email') + '：'" />&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="search" @click="search">{{$t('Search')}}</q-btn>&nbsp;&nbsp;
                        <q-btn push dense color="primary" icon="add" @click="addUser">{{$t('Add')}}</q-btn>
                    </template>
                    <template slot="top-right" slot-scope="props">
                        <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" />
                    </template>
                    <template slot="top-selection" slot-scope="props">
                        <q-btn color="negative" flat round delete icon="delete" @click="delUsers" />
                    </template>
                    <q-td slot="body-cell-id" slot-scope="props" :props="props" style="width:100px">
                        <q-btn small round push glossy dense icon="edit" color="primary" @click="editUser(props.value)"></q-btn>
                        <q-btn small round push glossy dense icon="delete" color="red" @click="delUser(props.value)"></q-btn>
                    </q-td>
                </q-table>
            </q-card-main>
        </q-card>
        <q-modal v-model="editModal" :content-css="{minWidth: '400px', minHeight: '500px'}">
            <q-modal-layout>
                <q-toolbar slot="header">
                    <q-btn flat round dense @click="editModal = false" icon="reply" />
                    <q-toolbar-title>
                        {{$t('Edit')}}
                    </q-toolbar-title>
                </q-toolbar>
                <q-toolbar slot="footer">
                    <q-toolbar-title>
                    </q-toolbar-title>
                    <q-btn round @click="saveUser">{{$t('Save')}}</q-btn>
                    <q-btn round color="red" @click="editModal = false">{{$t('Cancel')}}</q-btn>
                </q-toolbar>

                <div class="layout-padding">
                    <q-field :count="15">
                        <q-input v-model="tempUser.name" :float-label="$t('Account Name')" />
                    </q-field>
                    <q-field :count="15">
                        <q-input v-model="tempUser.trueName" :float-label="$t('Username')" />
                    </q-field>
                    <q-field :count="15">
                        <q-input v-model="tempUser.email" :float-label="$t('Email')" />
                    </q-field>
                     <q-field :count="15">
                        <q-input v-model="tempUser.phone" float-label="Phone" />
                    </q-field>
                </div>
            </q-modal-layout>
        </q-modal>
    </div>
</template>

<script>
import {
  getUserPagedList,
  delUser,
  delUsers,
  saveUser
} from "@/service/user/user";
export default {
  name: "user",
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
      selected: [],
      loading: false,
      editModal: false,
      tempUser: {
        id: 0,
        name: "",
        trueName: "",
        email: "",
        phone:""
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
    async delUser(id) {
      try {
        await this.$q.dialog({
          title: this.$t("Delete"),
          message: this.$t("Confirm the deletion？"),
          position: "right",
          ok: {
            push: true,
            label: this.$t("Delete")
          },
          cancel: {
            push: true,
            color: "negative",
            label: this.$t("Cancel")
          }
        });
        await delUser({ id: id });
        this.$q.notify({
          type: "positive",
          message: this.$t("Successfully deleted"),
          position: "bottom-right"
        });
        this.search();
      } catch (e) {}
    },
    async delUsers() {
      try {
        await this.$q.dialog({
          title: this.$t("Batch deletion"),
          message: this.$t("Confirm the bulk delete operation？"),
          ok: {
            push: true,
            label: this.$t("Delete")
          },
          cancel: {
            push: true,
            color: "negative",
            label: this.$t("Cancel")
          }
        });
        await delUsers({
          ids: JSON.stringify(
            this.selected.map(s => {
              return s.id;
            })
          )
        });
        this.$q.notify({
          type: "positive",
          message: this.$t("Batch delete succeeded"),
          position: "bottom-right"
        });
        this.selected = [];
        this.search();
      } catch (e) {}
    },
    editUser(id) {
      let editRole = this.serverData.filter(s => {
        return s.id === id;
      });
      if (editRole && editRole.length > 0) {
        this.tempUser = JSON.parse(JSON.stringify(editRole[0]));
      } else {
        return true;
      }
      this.editModal = true;
    },
    async saveUser() {
      await saveUser(this.tempUser);
      this.$q.notify({
        type: "positive",
        message: this.$t("Saved successfully"),
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
    addUser() {
      this.tempUser = {};
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
