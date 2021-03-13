<template>
  <nav role="navigation" class="h-full absolute top-0 right-0" v-if="navConfig">
     
    <div v-for="icon in navConfig.tabs" class="bg-gray-300 hover:bg-blue-400 cursor-pointer p-4 mb-1 border-black border-2 rounded-l-lg">
        {{icon.label}}
    </div>


</nav>
</template>


<script>
 

import Config from '../config/MiniNav2.js'

export default {
  name: 'MiniNav',
  props: [ 'web3Plug' ],
  components:{ },
  data() {
    return {
      

      navConfig: null
    }
  },
  created(){

    this.navConfig = Config;
  console.log(  'meep', this.navConfig )
 


  },
  methods: {

         

  }
}
</script>
