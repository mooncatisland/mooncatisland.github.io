<template>
  <div class="text-gray-700">
     <h3 class="text-lg font-bold inline  "> Welcome to Mooncat Island </h3>
    <p> There are so many fun ways to hang with your Mooncats! </p>

    <ul>
      <li v-for="item in navConfig.tabs">

      {{item.label}} - {{item.description}}   
        
      </li>
      
      
    </ul>


    <h3 class="text-lg font-bold inline  "> How does it work? </h3>
    <p> Mooncat Island lets you play with your fuzzy friend while they sit cozy in Ethereum Mainnet! </p>

    <p> Even though your Mooncats will stay in Mainnet, Mooncat Island runs on Matic Sidechain. </p>

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
