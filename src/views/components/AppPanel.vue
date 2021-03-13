
<template>
    <div class=" text-gray-700 p-8">

      
  



      <div v-if="activePanelId==null " >
          <WelcomePanel
           v-bind:web3Plug="web3Plug"
            />
      </div>


       <div v-if="activePanelId=='cats' " >
          <CatsPanel
           v-bind:web3Plug="web3Plug"
            />
      </div>

       <div v-if="activePanelId=='bank' " >
          <BankPanel
           v-bind:web3Plug="web3Plug"
            />
      </div>

       <div v-if="activePanelId=='launchpad' " >
          <SpaceLaunchPanel
           v-bind:web3Plug="web3Plug"
            />
      </div>

       <div v-if="activePanelId=='toys' " >
          <ToysPanel
           v-bind:web3Plug="web3Plug"
            />
      </div>





    </div>
</template>

<script>

const Web3 = require('web3')

var BN = Web3.utils.BN;


const CryptoAssets = require('../../config/cryptoassets.json')

 
import WelcomePanel from '../panels/WelcomePanel.vue' 
import BankPanel from '../panels/BankPanel.vue' 
import SpaceLaunchPanel from '../panels/SpaceLaunchPanel.vue' 
import ToysPanel from '../panels/ToysPanel.vue' 
import CatsPanel from '../panels/CatsPanel.vue' 

import Web3Plug from '../../js/web3-plug.js'

export default {
  name: 'AppPanel',
  props: ['web3Plug', 'activePanelId', 'onClickedCallback'], 
  components:{  WelcomePanel, BankPanel, SpaceLaunchPanel , ToysPanel, CatsPanel },
  data() {
    return {
      activeAccountAddress: null,
      providerNetworkID: null,

      

      txError: null,

      networkProviderIdError: null
    }
  },
 async  mounted()
  {
     
  },
  updated()
  {

    //this.updateAll();
  },
  methods: {


  

 



  }
}

</script>
