<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <q-table
          title="客户跟踪服务"
          color="primary"
          :data="data"
          :columns="columns"
          row-key="name"
          :separator="separator"
          :fullscreen ="fullscreen"
          :visible-columns="visibleColumns"
          :card-style="cardStyle"
          :style="tableStyle"
          :pagination.sync="pagination_data"

      >
        <template v-slot:top>
          <div style="width: 100%;text-align: center">
            <h5 style="margin-left: 30px;">生产跟踪</h5>
          </div>
        </template>

        <template v-slot:bottom>
          <div style="width: 100%;display: flex;justify-content: center">
            <div class="row justify-center q-mt-md">
              <q-pagination
                  v-model="pagination_data.page"
                  color="grey-8"
                  :max="pagesNumber"
                  size="sm"
              />
            </div>
          </div>

        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
// const fs = require('fs');
// const {resolve} = require('path')
export default {
  name: "TEST",
  props: {
    separator: {
      type: String,
      default: "horizontal"
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: null
    },
    data: {
      type: Array,
      default: null
    },
    visibleColumns:{
      type: Array,
      default: null
    },
    tableStyle:{
      type: Object,
      default: null
    },
    cardStyle: {
      type: Object,
      default: null
    },
    pagination: {
      type: Object,
      default: () => {
        return {
          page: 1,
          rowsPerPage: 6
        }
      }
    },
    time: {
      type: Number,
      default: 5
    }

  },
  mounted() {
    // fs.readFile("/Users/looper/Documents/code/project/electron-bd/package.json","utf8",(err,data) => {
    //   console.log(err,data);
    // })
    // console.log('__dirname : ' + __dirname)
    // console.log('resolve   : ' + resolve('./'))
    // console.log('cwd       : ' + process.cwd())
    console.log(this.tbaledata);
    this.timer = setInterval(() => {
      if (this.pagination_data.page === this.pagesNumber){
        this.pagination_data.page = 1;
      }else{
        this.pagination_data.page++;
      }
    },this.time * 1000);
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.data.length / this.pagination.rowsPerPage)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  data () {
    return {
      tbaledata: this.data,
      pagination_data: this.pagination,
      timer: null
    }
  }
}
</script>

<style scoped>
.full_but{
  opacity: 0;
}

.full_but:hover{
  opacity: 1;
}
</style>
