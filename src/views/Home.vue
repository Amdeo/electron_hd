<template>
  <div class="home">
    <img style="margin-top: 10%;" alt="Vue logo" src="../assets/logo.png">
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
<!--    <TEST style="display:none;" :columns="columns" :data="data"></TEST>-->
    <div class="select_File">
      <q-input style="width:50%" outlined v-model="text" label="文件路径" />
      <q-btn style="margin-left: 30px" color="secondary" label="选择excel文件" @click="openfile"/>
    </div>
    <q-btn style="margin-top:10%; width: 100px" color="primary" label="开    始" size="20px" @click="toDataDisplay" />
  </div>
</template>

<script>
// @ is an alias to /src
// import TEST from "@/components/TEST.vue";
// import XLSX from "xlsx";


export default {
  name: 'Home' ,
  components: {
    // HelloWorld,
    // TEST
  },
  data() {
    return {
      text: "",
    }
  },
  mounted() {
    this.text = this.$store.state.filepath;
  },
  methods: {
    openfile() {
      // console.log(document.getElementById("myFile").files[0].path);
      const { dialog } = require('electron').remote;
      dialog.showOpenDialog({
        title:"选择excel文件",
        filters:[
          { name: 'excel', extensions: ['xls', 'xlsx'] },
        ]
      }).then(result => {
        if (result.filePaths.length > 0){
          this.text = result.filePaths[0];
        }
        console.log(result.filePaths);
      })
    },
    toDataDisplay(){
      this.$store.commit("setFilePath",this.text);
      this.$router.push("/DataDisplay");
    }
  }
}
</script>

<style>
.home {
  display:flex;
  flex-direction:column;
  /*justify-content:center;*/
  align-items:center;
}

.select_File{
  width: 90%;
  height: 20%;
  display:flex;
  justify-content:center;
  margin-top: 10%;
}

</style>
