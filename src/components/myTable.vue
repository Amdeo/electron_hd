<template>
  <div class="q-pa-md">
    <div class="q-pa-md">
      <q-table
          title="客户跟踪服务"
          color="amber"
          :data="data"
          :columns="columns"
          row-key="name"
          :separator="separator"
          :fullscreen="fullscreen"
          :visible-columns="visibleColumns"
          :card-style="cardStyle"
          :table-style="tableStyle"
          style=""
          :pagination.sync="pagination_data"
      >
        <template v-slot:top>

          <div class="top_view">
            <div style="width:30%;height:100%"></div>
            <div style="width: 40%;text-align: center">
              <h5 style="margin-left: 30px;">{{ title }}</h5>
            </div>
            <div style="width:30%">{{newDate}}</div>
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
  name: "myTable",
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
    visibleColumns: {
      type: Array,
      default: null
    },
    tableStyle: {
      type: String,
      default: ""
    },
    cardStyle: {
      type: String,
      default: ""
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
    },
    title: {
      type: String,
    }
  },
  mounted() {
    // console.log('time', this.time);
    this.timer = setInterval(() => {
      // console.log('tab_time_interval',this.tab_time_interval);
      if (this.pagination_data.page === this.pagesNumber) {
        this.pagination_data.page = 1;
      } else {
        this.pagination_data.page++;
      }
    }, this.time * 1000);
    let that = this
    this.timer1 = setInterval(function () {
      that.newDate = new Date().toLocaleString()
    })
  },
  computed: {
    pagesNumber() {
      return Math.ceil(this.data.length / this.pagination.rowsPerPage)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
    this.timer = null;
    this.timer1 = null;
  },
  data() {
    return {
      tbaledata: this.data,
      pagination_data: this.pagination,
      timer: null,
      newDate: new Date()
    }
  }
}
</script>

<style scoped>
.full_but {
  opacity: 0;
}

.full_but:hover {
  opacity: 1;
}

/*th {*/
/*  font-size: 100px;*/
/*}*/

.headerClass {
  font-size: 100px;
}

.top_view{
  width:100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
