<template>
  <div class="settings">
    <div class="tab_view">
      <q-tabs
          v-model="tab"
          inline-label
          :breakpoint="0"
          align="justify"
          active-color="primary"
          indicator-color="purple"
      >
        <q-tab name="basic" label="基础配置"/>
        <q-tab name="column_def" label="列定义"/>
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="basic">
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">行数</div>
            <el-input style="width:80%;" v-model="settings.pagination.rowsPerPage" placeholder="请输入内容"></el-input>
          </div>
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">切换间隔</div>
            <el-input style="width:80%;" v-model="settings.tab_time_interval" placeholder="请输入内容"></el-input>
          </div>
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">加载间隔</div>
            <el-input style="width:80%;" v-model="settings.reload_time_interval" placeholder="请输入内容"></el-input>
          </div>
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">表格背景颜色</div>
            <el-input style="width:80%;" v-model="settings.tableStyle" placeholder="请输入内容"></el-input>
          </div>
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">标题</div>
            <el-input style="width:80%;" v-model="settings.title" placeholder="请输入内容"></el-input>
          </div>
          <div class="line_view">
            <div style="padding: 0 10px;font-size: 15px; width: 80px">分隔栏</div>
            <q-option-group
                v-model="settings.separatorValue"
                inline
                :options="[

                  { label: 'Horizontal (default)', value: 'horizontal' },
                  { label: 'Vertical', value: 'vertical' },
                  { label: 'Cell', value: 'cell' },
                  { label: 'None', value: 'none' },
                ]"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel v-if="refresh" name="column_def">
          <q-table
              :data="data"
              :columns="columns"
              row-key="name"
              virtual-scroll
              style="height: 400px"
              :pagination.sync="pagination"
              :rows-per-page-options="[0]"
          >
            <template v-slot:top>
              <q-btn color="primary" :disable="loading" label="增加行" @click="addRow"/>
              <q-btn class="q-ml-sm" color="primary" :disable="loading" label="删除行" @click="removeRow"/>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                  <q-popup-edit v-model="props.row.name">
                    <q-input v-model="props.row.name" dense autofocus counter/>
                  </q-popup-edit>
                </q-td>
                <q-td key="td_style" :props="props">
                  {{ props.row.td_style }}
                  <q-popup-edit v-model="props.row.td_style">
                    <q-input v-model="props.row.td_style" dense autofocus counter/>
                  </q-popup-edit>
                </q-td>
                <q-td key="th_style" :props="props">
                  {{ props.row.th_style }}
                  <q-popup-edit v-model="props.row.th_style">
                    <q-input v-model="props.row.th_style" dense autofocus counter/>
                  </q-popup-edit>
                </q-td>
                <q-td key="display" :props="props">
                  <q-toggle v-model="props.row.display" label=""/>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <div>
            <div class="line_view">
              <div style="padding: 0 10px;font-size: 15px; width: 80px">批量td样式修改</div>
              <el-input style="width:80%;" v-model="td_style" placeholder="请输入内容"></el-input>
              <q-btn color="primary" label="覆盖" @click="batchModTd"/>
            </div>
            <div class="line_view">
              <div style="padding: 0 10px;font-size: 15px; width: 80px">批量th样式修改</div>
              <el-input style="width:80%;" v-model="th_style" placeholder="请输入内容"></el-input>
              <q-btn color="primary" label="覆盖" @click="batchModTh"/>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="bottom_view">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>

<script>
const ipcRenderer = require('electron').ipcRenderer;

export default {
  name: "Setting",
  data() {
    return {
      tab: "basic",
      // table_background_color: "#fff",
      pagination: {
        rowsPerPage: 0
      },
      columns: [
        {
          name: "name",
          label: "名称",
          align: "center",
          field: "名称",
          format: val => `${val}`,
        },
        {
          name: "td_style",
          label: "td样式",
          align: "center",
          field: "td样式",
          format: val => `${val}`,
        },
        {
          name: "th_style",
          label: "th样式",
          align: "center",
          field: "th样式",
          format: val => `${val}`,
        },
        {
          name: "display",
          label: "可见",
          align: "center",
          field: "可见",
          format: val => `${val}`,
        },
      ],
      data: [],
      // title: "",
      settings: {},
      td_style: "",
      th_style: "",
      refresh: true
    }
  },
  created() {
    ipcRenderer.on("fromParentData", ((event, args) => {
      console.log(args);
    }))
  },
  mounted() {
    this.getlocalStorageScoped();
    if (this.data.length === 0) {
      let data = [];
      for (let col_name of this.settings.visibleColumns) {
        data.push({
          name: col_name,
          td_style: "",
          th_style: "",
          display: true
        })
      }
      this.data = data;
    }
  },
  methods: {
    close() {
      ipcRenderer.send("close_settings");
    },
    save() {
      this.setlocalStorageScoped();
      ipcRenderer.send("confirm");
    },
    getlocalStorageScoped() {
      this.settings = JSON.parse(localStorage.getItem("settings"));
      if (this.settings.col_def_data) {
        this.data = this.settings.col_def_data;
      }
      this.td_style = localStorage.getItem("td_style_record");
      this.th_style = localStorage.getItem("th_style_record");
    },
    setlocalStorageScoped() {
      this.settings.col_def_data = this.data;
      localStorage.setItem("settings", JSON.stringify(this.settings));
    },
    addRow() {
      this.data.push({
        name: "",
        td_style: "",
        th_style: "",
        display: true
      })
    },
    removeRow() {
      this.data.pop();
    },
    Refresh() {
      this.refresh = false;
      this.$nextTick(() => {
        this.refresh = true;
      })
    },
    batchModTd() {
      for (let item of this.data) {
        item.td_style = this.td_style;
      }
      localStorage.setItem("td_style_record", this.td_style);
    },
    batchModTh() {
      for (let item of this.data) {
        item.th_style = this.th_style;
      }
      localStorage.setItem("th_style_record", this.th_style);
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  height: 100%;
  width: 100%;
}

.settings {
  width: 100%;
  height: 100%;

  .tab_view {
    height: 80%;
    width: 100%;
  }
}

.line_view {
  display: flex;
  align-items: center;
  //justify-content: center;
  padding: 10px 0;
}

.bottom_view {
  position: fixed;
  display: flex;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  bottom: 100px;
  left: 0;
  right: 0;
  top: 0;
  width: 100px;
  height: 50px;
}

</style>