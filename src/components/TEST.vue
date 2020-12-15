<template>
  <div class="q-pa-md">
<!--    <q-table-->
<!--        title="Treats"-->
<!--        :data="data"-->
<!--        :columns="columns"-->
<!--        row-key="name"-->
<!--        :separator="separator"-->
<!--        :fullscreen ="fullscreen"-->
<!--    >-->
<!--      -->
<!--    </q-table>-->
    <div class="q-pa-md">
      <q-table
          title="Treats"
          :data="data"
          :columns="columns"
          row-key="name"
          :separator="separator"
          :fullscreen ="fullscreen"
      >
        <template v-slot:top="props">
          <q-btn
              flat round dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              class="q-ml-md full_but"
          />
        </template>
<!--        <template v-slot:body="props">-->
<!--          <q-tr :props="props">-->
<!--            <q-td key="name" :props="props">-->
<!--              {{ props.row.name }}-->
<!--            </q-td>-->
<!--            <q-td key="calories" :props="props">-->
<!--              <q-badge color="green">-->
<!--                {{ props.row.calories }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="fat" :props="props">-->
<!--              <q-badge color="purple">-->
<!--                {{ props.row.fat }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="carbs" :props="props">-->
<!--              <q-badge color="orange">-->
<!--                {{ props.row.carbs }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="protein" :props="props">-->
<!--              <q-badge color="primary">-->
<!--                {{ props.row.protein }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="sodium" :props="props">-->
<!--              <q-badge color="teal">-->
<!--                {{ props.row.sodium }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="calcium" :props="props">-->
<!--              <q-badge color="accent">-->
<!--                {{ props.row.calcium }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--            <q-td key="iron" :props="props">-->
<!--              <q-badge color="amber">-->
<!--                {{ props.row.iron }}-->
<!--              </q-badge>-->
<!--            </q-td>-->
<!--          </q-tr>-->
<!--        </template>-->
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
  },
  data () {
    return {
      tbaledata: this.data
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