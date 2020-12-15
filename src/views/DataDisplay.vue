<template>
  <div class="DataDisplay">
    <TEST id="tables" :separator="separatorValue" :columns="columns" :data="TableData"></TEST>
    <div class="buts">
      <q-btn style="margin-right: 1vh" color="deep-orange" glossy label="返回" size="20px" @click="ToHome"/>
      <q-btn style="margin-left: 1vh" color="secondary" glossy :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
             :label="$q.fullscreen.isActive ? '退出全屏' : '进入全屏'"  size="20px" @click="toggle"/>
    </div>
<!--    <q-btn  color="deep-orange" glossy label="返回" size="20px" @click="scale"/>-->
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
  </div>
</template>

<script>

import TEST from "@/components/TEST.vue";
const remote = require('electron').remote;
// const electron = require('electron')
import XLSX from "xlsx";
export default {
  name: "DataDisplay",
  components:{
    TEST
  },
  data() {
    return {
      separatorValue: "horizontal",
      filePath : "",
      excelData: [],
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
      TableData: []
    }
  },
  mounted() {
    // 获取文件路径
    this.filePath = this.$store.state.filepath;
    console.log(this.filePath);
    if (this.filePath === "") {
      this.$router.push("/")
    }else{
      try{
        const workbook =  XLSX.readFile(this.filePath,{cellDates: true});
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
            new_item[newcol] = item[col];
          }
          return new_item;
        })
        console.log(Newws);
        this.$store.commit("setExcelData",Newws);
        this.excelData = Newws;
        // console.log(this.excelData);
        this.excelData_to_ui();
      }
      catch(err){
        console.log(err);
        alert(err);
        if (String(err).indexOf("no such file or directory") !== -1){
          alert("不是有效文件,请重新选择");
          this.$router.push("/")
        }
      }
    }
  },
  methods: {
    ToHome() {
      this.$router.push("/");
    },
    // scale(){
    //   const win = remote.getCurrentWindow();
    //   win.webContents.setZoomLevel(0);
    //
    // },
    toggle() {
      const win = remote.getCurrentWindow();
      win.autoHideMenuBar = true;
      const node = document.getElementById("tables");
      this.$q.fullscreen.toggle(node)
          .then(() => {
          })
          .catch((err) => {
            alert(err)
          })
    },
    excelData_to_ui() {
      if (this.excelData.length > 0){
        for (let item of this.excelData){
          // console.log(item);
          let temp = {};
          for (let col of this.columns) {
            // console.log('item',item);
            // console.log('col',col)
            if (Object.prototype.hasOwnProperty.call(item,col.label)){
              temp[col.label] = item[col.label];
            }else{
              if (col.label === "状态") {
                do {
                  if (Object.prototype.hasOwnProperty.call(item,"正常")) {
                    if (item["正常"] === "是") {
                      temp["状态"] = "正常";
                      break;
                    }
                  }

                  if (Object.prototype.hasOwnProperty.call(item,"可能延期")) {
                    if (item["可能延期"] === "是") {
                      temp["状态"] = "可能延期";
                      break;
                    }
                  }

                  if (Object.prototype.hasOwnProperty.call(item,"确定延期")) {
                    if (item["确定延期"] === "是") {
                      temp["状态"] = "确定延期";
                      break;
                    }
                  }

                  // eslint-disable-next-line no-constant-condition
                }while(false);
                if (!Object.prototype.hasOwnProperty.call(temp,"状态")) {
                  if (this.TableData.length > 0){
                    if (Object.prototype.hasOwnProperty.call(this.TableData[this.TableData.length - 1],"状态")){
                      temp[col.label] = this.TableData[this.TableData.length - 1]["状态"];
                    }
                  }
                }

              }else{
                if (this.TableData.length > 0){
                  if (Object.prototype.hasOwnProperty.call(this.TableData[this.TableData.length - 1],col.label)) {
                    // 客户名称，直接去上一行的
                    if (col.label === "客户名称"){
                      temp[col.label] = this.TableData[this.TableData.length - 1][col.label];
                    }
                    else{
                      //要求客户名称一样才可以拷贝
                      if (this.TableData[this.TableData.length - 1]["客户名称"] === temp["客户名称"]){
                        temp[col.label] = this.TableData[this.TableData.length - 1][col.label];
                      }
                    }
                  }else{
                    temp[col.label] = ""
                  }
                }else{
                  temp[col.label] = ""
                }

                if (!Object.prototype.hasOwnProperty.call(temp,col.label)){
                  temp[col.label] = ""
                }
              }
            }
          }
          this.TableData.push(temp);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.DataDisplay{
  width:100%;
  height:100%;
  //background-color:#C10015;
  #tables{
    background-color: #fff;
  }
  .buts {
    width:40%;
    height:100px;
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom: 0;
    margin-top:auto;
    margin-left:auto;
    margin-right:auto;
  }
}
</style>
