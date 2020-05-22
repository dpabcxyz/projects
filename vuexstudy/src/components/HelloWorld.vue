<template>
  <div class="hello">
    <button @click="increment">增加</button>
    <button @click="decrement">减小</button>
    <h1>{{count}}</h1>
    <h2>{{isEvenorOdd}}</h2>
    <h2>{{name}}</h2>
  </div>
</template>

<script>
import {mapGetters,mapState,mapActions} from 'vuex'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },

  //第一种方式
  // computed:{
  //   count(){
  //     return this.$store.state.count;
  //   }
  // }

  //直接获取state
  // computed:mapState([
  //   'count1'
  // ]),
  computed:{
    ...mapGetters('test',['count','isEvenorOdd']),
    ...mapGetters('namespace',['name'])
  },
  methods:{
    ...mapActions('test',[ 'increment','decrement'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
