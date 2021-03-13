<template>
  <div class="text-gray-700">
     <h3 class="text-lg font-bold inline  "> Welcome to Mooncat Island </h3>
    <p> There are so many fun ways to hang with your Mooncats! </p>

    <ul>
      <li v-for="item in navConfig.tabs">

      {{item.label}} - {{item.description}}   
        
      </li>
      
      
    </ul>

  </div>
</template>


<script>


import MiniNavConfig from '../config/MiniNav2.js'

export default {
  name: 'WelcomePanel',
  props: [],
  data() {
    return {
        navConfig: null
    }
  },
  created(){
     this.navConfig = MiniNavConfig;
    console.log(this.navConfig)

  },
  methods: {

  }
}
</script>
