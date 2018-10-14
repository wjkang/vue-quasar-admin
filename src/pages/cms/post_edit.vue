 <template>
  <div class="row  gutter-sm" style="padding:10px">
    <div class="col-9">
      <q-card inline class="fit shadow-6">
        <div class="row q-ma-lg q-pa-md">
          <div class="col-1">{{$t('Title')}}：</div>
          <div class="col">
            <q-input v-model="post.title" />
          </div>
        </div>
        <div class="row q-ma-lg q-pa-md">
          <div class="col-1">{{$t('Brief')}}：</div>
          <div class="col">
            <q-input type="textarea" v-model="post.shortContent" />
          </div>
        </div>
        <div id="editor">
          <mavon-editor v-model="post.mdContent" :toolbars="editorToolbars" @change="editorChange" style="height: 100%"></mavon-editor>
        </div>
      </q-card>
    </div>
    <div class="col-3">
      <q-card inline class="fit shadow-6 q-pa-md">
        <q-card-main>
          <div class="row q-mt-md">
            <div class="col-4" style="line-height:40px">{{$t('Classification')}}:</div>
            <div class="col-5">
              <q-select inverted color="primary" placeholder="--请选择--" separator v-model="post.catelog" :options="catelogs" v-ripple />
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-4">{{$t('System label')}}:</div>
            <div class="col-5">
              <q-select multiple chips color="purple" placeholder="--请选择--" v-model="post.tags" :options="tagOptions" />
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-4">{{$t('Keywords')}}:</div>
            <div class="col-5">
              <q-chips-input color="secondary" v-model="post.keyWord" placeholder="" />
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-4">{{$t('Sort')}}:</div>
            <div class="col-5">
              <q-input type="number" v-model="post.sort" min="0" />
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-4">{{$t('Release time')}}:</div>
            <div class="col">
              <q-datetime color="purple" v-model="post.publishedDate" type="datetime" />
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-2" style="line-height:35px">{{$t('Status')}}:</div>
            <div class="col">
              <q-option-group inline type="radio" color="secondary" v-model="post.status" :options="[
          { label: $t('Draft'), value: 1, color: 'faded'},
          { label: $t('Release'), value: 2, color: 'primary'},
          { label: $t('Delete'), value: 3, color: 'red' }
        ]" />
            </div>
          </div>
        </q-card-main>
        <q-card-separator />
        <q-card-actions align="end">
          <q-btn push class="bg-primary text-white" @click="savePost">{{$t('Save')}}</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
// Local Registration
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { getPost, savePost } from "@/service/cms/post";

export default {
  name: "post_edit", //不加不会被缓存
  components: {
    mavonEditor
    // or 'mavon-editor': mavonEditor
  },
  data() {
    return {
      post: {
        id: "",
        title: "",
        catelog: "",
        tags: [],
        keyWord: [],
        status: 0,
        sort: 0,
        mdContent: "",
        htmlContent: "",
        shortContent: "",
        isTimePublish: "",
        publishedDate: undefined
      },
      catelogs: [
        {
          label: this.$t("Home notification"),
          value: this.$t("Home notification")
        },
        {
          label: this.$t("Front end"),
          value: this.$t("Front end")
        },
        {
          label: this.$t("Back end"),
          value: this.$t("Back end")
        },
        {
          label: this.$t("Life"),
          value: this.$t("Life")
        }
      ],
      tagOptions: [
        {
          label: "webpack",
          value: "webpack"
        },
        {
          label: "vue",
          value: "vue"
        },
        {
          label: "quasar",
          value: "quasar"
        },
        {
          label: "react",
          value: "react"
        },
        {
          label: "angular",
          value: "angular"
        }
      ],
      editorToolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: false, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  methods: {
    async fetchData() {
      if (!this.$route.params.id) {
        this.post = {
          id: "",
          title: "",
          catelog: "",
          tags: [],
          keyWord: [],
          status: 0,
          sort: 0,
          mdContent: "",
          htmlContent: "",
          shortContent: "",
          isTimePublish: "",
          publishedDate: undefined
        };
        return;
      }
      try {
        let res = await getPost(this.$route.params.id);
        let post = res.data.data;
        post.tags = post.tags.split(",");
        if (post.keyWord != "") {
          post.keyWord = post.keyWord.split(",");
        } else {
          post.keyWord = [];
        }

        if (post.publishedDate == 0) {
          post.publishedDate = undefined;
        }

        this.post = post;
      } catch (e) {}
    },
    editorChange(value, render) {
      this.post.htmlContent = render;
    },
    async savePost() {
      let errorMsg = [];
      if (this.post.title == "") {
        errorMsg.push(this.$t("The title can not be blank"));
      }
      if (this.post.shortContent == "") {
        errorMsg.push(this.$t("Brief description cannot be empty"));
      }
      if (this.post.mdContent == "") {
        errorMsg.push(this.$t("The content can not be blank"));
      }
      if (this.post.catelog == "") {
        errorMsg.push(this.$t("Classification cannot be empty"));
      }
      if (errorMsg.length > 0) {
        this.$q.notify({
          type: "negative",
          message: errorMsg.join(","),
          position: "bottom-right"
        });
        return;
      }
      try {
        await savePost(this.post);
        this.$q.notify({
          type: "positive",
          message: this.$t("Saved successfully"),
          position: "bottom-right"
        });
      } catch (e) {}
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route(to) {
      if (to.name == "post_edit" && this.$route.params.id != this.post.id) {
        this.fetchData();
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
    <style>
#editor {
  margin: auto;
  width: 100%;
  height: 550px;
}
</style>
