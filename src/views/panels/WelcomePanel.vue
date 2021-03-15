<template>
  <div class="text-gray-700">
     <h3 class="text-lg font-bold inline  "> Welcome to Mooncat Island </h3>
    <p> There are so many fun ways to hang with your Mooncats! </p>

    <ul>
      <li v-for="item in navConfig.tabs">

      {{item.label}} - {{item.description}}   
        
      </li>
      
      
    </ul>

    <hr> 
    <h3 class="text-lg font-bold inline  "> How does it work? </h3>
    <p> Mooncat Island lets you play with your fuzzy friend while they sit cozy in Ethereum Mainnet! </p>

    <p> Even though your Mooncats will stay in Mainnet, Mooncat Island runs on Matic Sidechain. </p>
    <div> 1. Setup your Metamask to use the Matic/Polygon Network:  <div @click="addMaticNetwork()" class="bg-blue-400 hover:bg-blue-700 p-1 rounded cursor-pointer inline text-white text-xs">  Add Matic Network </div> </div>
     <div> 2. Using the same account (Public Address) that holds your Mooncats on Mainnet, acquire some Matic on that account in the Matic Network to pay for gas. </div>
      <div> 3. You are all ready to play!  </div>

  </div>
</template>


<script>


import MiniNavConfig from '../config/MiniNav2.js'

export default {
  name: 'WelcomePanel',
  props: ['web3Plug'],
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
    addMaticNetwork(){
        this.web3Plug.requestAddMaticNetwork()

    }
  }
}
</script>
