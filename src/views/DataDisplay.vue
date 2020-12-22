<template>
  <div class="DataDisplay">
    <TEST id="tables" v-if="Refresh && time" :time="time" :pagination="pagination" :fullscreen="fullscreen"
          :separator="separatorValue"
          :columns="columns" :data="TableData" :visibleColumns="visibleColumns"></TEST>
    <div class="right-bottom-buts">
      <q-btn style="margin-bottom: 20px;" class="glossy" round color="deep-orange" icon="keyboard_arrow_left"
             @click="ToHome"/>
      <q-btn style="margin-bottom: 20px;" class="glossy" round color="secondary"
             :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="toggle"/>
    </div>
    <h5>列可见</h5>
    <div>
      <q-toggle v-model="visibleColumns" val="客户名称" label="客户名称"/>
      <q-toggle v-model="visibleColumns" val="状态" label="状态"/>
      <q-toggle v-model="visibleColumns" val="出货名称" label="出货名称"/>
      <q-toggle v-model="visibleColumns" val="数量" label="数量"/>
      <q-toggle v-model="visibleColumns" val="交货日期" label="交货日期"/>
      <q-toggle v-model="visibleColumns" val="运输方式" label="运输方式"/>
      <q-toggle v-model="visibleColumns" val="付款方式" label="付款方式"/>
      <q-toggle v-model="visibleColumns" val="到款情况" label="到款情况"/>
      <q-toggle v-model="visibleColumns" val="配置清单" label="配置清单"/>
      <q-toggle v-model="visibleColumns" val="目前生产状态" label="目前生产状态"/>
      <q-toggle v-model="visibleColumns" val="备注" label="备注"/>
    </div>
    <h5>表格模式选择</h5>
    <q-option-group
        v-model="separatorValue"
        inline
        class="q-mb-md"
        :options="[

        { label: 'Horizontal (default)', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
        { label: 'Cell', value: 'cell' },
        { label: 'None', value: 'none' },
      ]"
    />
    <q-btn label="间隔时间(s)" color="primary" @click="prompt = true"/>
    <q-btn style="margin-left: 20px" label="行数" color="primary" @click="prompt1 = true"/>
    <q-btn style="margin-left: 20px" label="文件刷新时间" color="primary" @click="prompt2 = true"/>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">间隔时间设置(s)</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input type="number" dense v-model.number="time" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup/>
          <q-btn flat label="确定" v-close-popup @click="refresh"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prompt1" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">行数</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="number" dense v-model.number="pagination.rowsPerPage" autofocus
                   @keyup.enter="prompt1 = false"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup/>
          <q-btn flat label="确定" v-close-popup @click="refresh"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="prompt2" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">刷新时间(分钟)</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input type="number" dense v-model.number="reload_time" autofocus
                   @keyup.enter="prompt2 = false"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="取消" v-close-popup/>
          <q-btn flat label="确定" v-close-popup @click="pageRefresh"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

import TEST from "@/components/TEST.vue";

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
import XLSX from "xlsx";

export default {
  name: "DataDisplay",
  components: {
    TEST
  },
  data() {
    return {
      separatorValue: "horizontal",
      filePath: "",
      excelData: [],
      fullscreen: false,
      columns: [
        {
          name: '客户名称',
          label: '客户名称',
          align: 'center',
          field: '客户名称'
        },
        {
          name: '状态',
          label: '状态',
          align: 'center',
          field: "状态",
          format: val => `${val}`,
        },
        {
          name: '出货名称',
          label: '出货名称',
          align: 'center',
          field: "出货名称",
          format: val => `${val}`,
        },
        {
          name: '数量',
          label: '数量',
          align: 'center',
          field: "数量",
          format: val => `${val}`,
        },
        {
          name: '交货日期',
          label: '交货日期',
          align: 'center',
          field: "交货日期",
          format: val => `${val}`,
        },
        {
          name: '运输方式',
          label: '运输方式',
          align: 'center',
          field: "运输方式",
          format: val => `${val}`,
        },
        {
          name: '售后服务',
          label: '售后服务',
          align: 'center',
          field: "售后服务",
          format: val => `${val}`,
        },
        {
          name: '付款方式',
          label: '付款方式',
          align: 'center',
          field: "付款方式",
          format: val => `${val}`,
        },
        {
          name: '到款情况',
          label: '到款情况',
          align: 'center',
          field: "到款情况",
          format: val => `${val}`,
        },
        {
          name: '配置清单',
          label: '配置清单',
          align: 'center',
          field: "配置清单",
          format: val => `${val}`,
          style: 'width: 200px;white-space:normal',
        },
        {
          name: '目前生产状态',
          label: '目前生产状态',
          align: 'center',
          field: "目前生产状态",
          format: val => `${val}`,
        },
        {
          name: '备注',
          label: '备注',
          align: 'center',
          field: '备注',
          format: val => `${val}`,
          style: 'width: 200px;white-space:normal',
        }
      ],
      TableData: [],
      visibleColumns: ["客户名称", "状态", "出货名称", "数量", "交货日期", "运输方式", "付款方式", "到款情况", "配置清单", "目前生产状态", "备注"],
      pagination: {
        page: 1,
        rowsPerPage: 6
      },
      time: null,
      prompt: false,
      prompt1: false,
      prompt2: false,
      Refresh: true,
      reload_timer: null,
      reload_time: null
    }
  },
  created() {
    // ipcRenderer.on('full-screen',(event,message) => {
    //     // console.log(message);
    //     // this.fullscreen = message;
    // });
    ipcRenderer.on('exit-full-screen', (event, message) => {
      this.fullscreen = message;
      // const win = remote.getCurrentWindow();
      // win.autoHideMenuBar = false;
    })
  },
  mounted() {
    // this.reload_time = this.$store.state.page_refresh_time;
    let reload_time = localStorage.getItem("pageRefreshTime");
    if (!reload_time) {
      this.reload_time = 30;
    }
    this.reload_time = reload_time;
    const win = remote.getCurrentWindow();
    if (!this.reload_timer) {
      if (this.reload_time) {
        console.log(`${this.reload_time}分钟刷新一次`);
        this.reload_timer = setInterval(() => {
          win.webContents.reload();
        }, this.reload_time * 60 * 1000);
      }
    }
    // 获取文件路径
    this.filePath = this.$store.state.filepath;
    const timeInterval = localStorage.getItem("timeInterval");
    if (timeInterval) {
      this.time = Number(timeInterval);
    }

    const col_num = localStorage.getItem("col_num");
    if (col_num) {
      this.pagination.rowsPerPage = col_num;
    }

    console.log(this.filePath);
    if (this.filePath === "") {
      this.$router.push("/")
    } else {
      try {
        const workbook = XLSX.readFile(this.filePath, {cellDates: true});
        // console.log(workbook),
        const wsname = workbook.SheetNames[0];
        // console.log(wsname);
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
        console.log(ws);
        var Newws = ws.map((item) => {
          let new_item = {};
          for (let col in item) {
            let newcol = col;
            newcol = newcol.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
            // console.log(col);
            let value = item[col];
            // console.log(typeof item[col]);
            if (col === "交货日期" && typeof (item[col]) === "number") {
              // console.log(item[col]);
              value = this.formatDate(item[col])
            }
            new_item[newcol] = value;
          }
          return new_item;
        })
        console.log(Newws);
        this.$store.commit("setExcelData", Newws);
        this.excelData = Newws;
        // console.log(this.excelData);
        this.excelData_to_ui();
        this
      } catch (err) {
        console.log(err);
        alert(err);
        if (String(err).indexOf("no such file or directory") !== -1) {
          alert("不是有效文件,请重新选择");
          this.$router.push("/")
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.reload_timer);
    this.reload_timer = null;
  },
  methods: {
    ToHome() {
      this.$router.push("/");
    },
    toggle() {
      this.fullscreen = true;
      const win = remote.getCurrentWindow();
      win.setFullScreen(true);
    },
    excelData_to_ui() {
      // 判断excel数据存在
      if (this.excelData.length > 0) {
        // 遍历excel数据
        for (let item of this.excelData) {
          let temp = {};
          // 遍历列名
          for (let col of this.columns) {
            // 判断key存在
            if (Object.prototype.hasOwnProperty.call(item, col.label)) {
              temp[col.label] = item[col.label];
            } else {
              if (col.label === "状态") {
                do {
                  if (Object.prototype.hasOwnProperty.call(item, "正常")) {
                    if (item["正常"] === "是") {
                      temp["状态"] = "正常";
                      break;
                    }
                  }

                  if (Object.prototype.hasOwnProperty.call(item, "可能延期")) {
                    if (item["可能延期"] === "是") {
                      temp["状态"] = "可能延期";
                      break;
                    }
                  }

                  if (Object.prototype.hasOwnProperty.call(item, "确定延期")) {
                    if (item["确定延期"] === "是") {
                      temp["状态"] = "确定延期";
                      break;
                    }
                  }

                  // eslint-disable-next-line no-constant-condition
                } while (false);
                if (!Object.prototype.hasOwnProperty.call(temp, "状态")) {
                  if (this.TableData.length > 0) {
                    if (Object.prototype.hasOwnProperty.call(this.TableData[this.TableData.length - 1], "状态")) {
                      temp[col.label] = this.TableData[this.TableData.length - 1]["状态"];
                    }
                  } else {
                    temp[col.label] = "";
                  }
                }
              } else {
                if (this.TableData.length > 0) {
                  if (Object.prototype.hasOwnProperty.call(this.TableData[this.TableData.length - 1], col.label)) {
                    // 客户名称，直接去上一行的
                    if (col.label === "客户名称") {
                      temp[col.label] = this.TableData[this.TableData.length - 1][col.label];
                    } else {
                      //要求客户名称一样才可以拷贝
                      if (this.TableData[this.TableData.length - 1]["客户名称"] === temp["客户名称"]) {
                        temp[col.label] = this.TableData[this.TableData.length - 1][col.label];
                      }
                    }
                  } else {
                    temp[col.label] = ""
                  }
                } else {
                  temp[col.label] = ""
                }

                if (!Object.prototype.hasOwnProperty.call(temp, col.label)) {
                  temp[col.label] = ""
                }
              }
            }
          }
          this.TableData.push(temp);
        }
      }
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return `${year}年format${month}月format${date}日`
      }
      return year + "年" + (month < 10 ? '0' + month : month) + "月" + (date < 10 ? '0' + date : date) + "日";
    },
    refresh() {
      // 刷新页面
      localStorage.setItem("timeInterval", this.time);
      localStorage.setItem("col_num", this.pagination.rowsPerPage);
      this.Refresh = false;
      this.$nextTick(() => {
        this.Refresh = true;
      })
      // const win = remote.getCurrentWindow();
      // win.webContents.reload();
    },
    pageRefresh() {
      // this.$store.commit("setpageRefreshTime", this.reload_time);
      // localStorage.setItem("timeInterval", this.time);
      localStorage.setItem("pageRefreshTime", this.reload_time);
      clearInterval(this.reload_timer);
      this.reload_timer = null;
      const win = remote.getCurrentWindow();
      win.webContents.reload();
    }
  }
}
</script>

<style lang="scss" scoped>
.DataDisplay {
  width: 100%;
  height: 100%;
  //background-color:#C10015;
  //display: flex;
  //flex-direction: column;
  //justify-content:center;
  text-align: center;

  #tables {
    background-color: #fff;
  }

  .buts {
    width: 40%;
    height: 100px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;
  }

  .right-bottom-buts {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
  }
}
</style>
