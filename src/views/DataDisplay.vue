<template>
  <div class="DataDisplay">
    <myTable id="tables" v-if="Refresh && settings.tab_time_interval"
             :time="settings.tab_time_interval"
             :pagination="settings.pagination"
             :fullscreen="fullscreen"
             :separator="settings.separatorValue"
             :columns="columns" :data="TableData" :visibleColumns="settings.visibleColumns"
             :tableStyle="settings.tableStyle"
             :title="settings.title"></myTable>
    <div class="right-bottom-buts">
      <q-btn style="margin-bottom: 20px;" class="glossy" round color="deep-orange" icon="keyboard_arrow_left"
             @click="ToHome"/>
      <q-btn style="margin-bottom: 20px;" class="glossy" round color="secondary"
             :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" @click="toggle"/>
      <q-btn style="margin-bottom: 20px;" class="glossy" round color="purple" icon="settings"
             @click="openSettings"/>
    </div>
  </div>
</template>

<script>
import myTable from "@/components/myTable.vue";

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
import XLSX from "xlsx";

export default {
  name: "DataDisplay",
  components: {
    myTable
  },
  data() {
    return {
      filePath: "",
      excelData: [],
      fullscreen: false,
      columns: [],
      TableData: [],
      Refresh: true,
      reload_timer: null,
      settings: {
        separatorValue: "horizontal",
        visibleColumns: [],
        pagination: {
          page: 1,
          rowsPerPage: 6
        },
        tab_time_interval: null,
        reload_time_interval: null,
        col_def_data: null,
        tableStyle: "",
        title: "",
      }
    }
  },
  created() {
    ipcRenderer.on('exit-full-screen', (event, message) => {
      this.fullscreen = message;
    })

  },
  mounted() {
    this.getLocalStorageScoped();
    this.col_gen();
    const win = remote.getCurrentWindow();
    if (!this.reload_timer) {
      if (this.reload_time_interval) {
        console.log(`${this.reload_time_interval}分钟刷新一次`);
        this.reload_timer = setInterval(() => {
          win.webContents.reload();
        }, this.reload_time_interval * 60 * 1000);
      }
    }
    this.readExcelfile();
  },
  beforeDestroy() {
    clearInterval(this.reload_timer);
    this.reload_timer = null;
  },
  methods: {
    col_gen() {
      this.settings.visibleColumns.forEach((item,index) => {
        let temp = {
          name: item,
          label: item,
          align: 'center',
          field: item,
          format: val => `${val}`,
          style: "", //不带头部
          headerStyle: ""
        }
        if (item === "配置清单" || item === "备注") {
          temp['style'] = "width:200px;white-space:normal;"
        }

        if (this.settings.col_def_data) {
          temp['headerStyle'] = temp['headerStyle'] + this.settings.col_def_data[index].th_style;
          temp['style'] = temp['style'] + this.settings.col_def_data[index].td_style;
        }

        this.columns.push(temp);
      })
    },
    readExcelfile() {
      // 获取文件路径
      this.filePath = localStorage.getItem("filePath");
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
        this.excelData.forEach((item, index) => {
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
          temp["序号"] = index + 1;
          this.TableData.push(temp);
        })
        // for (let item of this.excelData) {
        //
        // }
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
      this.Refresh = false;
      this.$nextTick(() => {
        this.Refresh = true;
      })
    },
    pageRefresh() {
      // this.setLocalStorageScoped();
      clearInterval(this.reload_timer);
      this.reload_timer = null;
      const win = remote.getCurrentWindow();
      win.webContents.reload();
    },
    getLocalStorageScoped() {
      const settings = localStorage.getItem("settings");
      if (settings) {
        this.settings = JSON.parse(settings);
        this.settings.visibleColumns = [];
        for (let item of this.settings.col_def_data){
          if (item.display){
            this.settings.visibleColumns.push(item.name);
          }
        }
      } else {
        this.settings.reload_time_interval = 30;
        this.settings.tab_time_interval = 5;
        this.settings.pagination.rowsPerPage = 6;
        this.settings.visibleColumns = ["序号", "客户名称", "状态", "出货名称", "数量", "交货日期", "运输方式", "付款方式", "到款情况", "配置清单", "目前生产状态", "备注"];
        this.settings.tableStyle = "background-color:#fff";
        this.settings.title = "生产跟踪";
        localStorage.setItem("settings", JSON.stringify(this.settings));
      }
    },
    openSettings() {
      ipcRenderer.send('openSetting')
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

.headerClass {
  font-size: 100px;
}
</style>
