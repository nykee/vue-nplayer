<template>
  <div id="app">
    <vue-nplayer :songLists="songLists"></vue-nplayer>
  </div>
</template>

<script>
  import axios from 'axios'

export default {
  name: 'App',
    data(){
      return{
          songLists:[]
      }
    },
  components: {
  },
    mounted(){
      axios.get('https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=songlist&id=2520942859').then(res=>{
          if(res.data.Code === "OK"){
              for (let i = 0, len = res.data.Body.length; i < len; i++) {
                  res.data.Body[i].index = i + 1;
              }
              this.songLists = res.data.Body;
              console.log(this.songLists[0])

//
          }
//          console.log(res);
      })

    }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
