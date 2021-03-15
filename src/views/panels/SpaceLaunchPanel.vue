<template>
  <div class="bg-gray-800 px-8 py-2">
     
       

       <div class="flex flex-row">
        <div class="flex-grow">
          <h3 class="text-lg font-bold   text-white"> Mooncat Island Space Program </h3>
        
          <div class="text-xs      text-gray-300"> Search the depths of space for fun cat toys! </div>
        </div>
        <div class="flex-grow text-black  text-center">
          <div class="w-full bg-yellow-200 rounded">
                 Moonmoney: {{  getMoonmoneyBalanceFormatted()  }}  🌕

           </div>
                  

          
          </div>

      </div>




    
  </div>
</template>


<script>

const axios = require('axios')
import MoonCatTools from '../../js/moon-cat-tools.js' 
import CatIndex from './subcomponents/CatIndex.vue'
import CatProfile from './subcomponents/CatProfile.vue'

const CryptoAssets = require('../../config/cryptoassets.json')


 const MoonMoneyABI = require('../../contracts/MoonMoney.json')
 
let moonCatTools = new MoonCatTools()

export default {
  name: 'CatsPanel',
  props: ['web3Plug'],
  components:{CatIndex,CatProfile},
  data() {
    return {
      currentBalances: {}  
    }
  },
  created: async function(){

       this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        
        
      }.bind(this));

      
     

  },
  mounted: async function(){

    await this.refreshBalances()
    setInterval(this.refreshBalances, 10*1000);

    //this is required due to using the formatting method 
     this.$forceUpdate();

  },
  methods: {

     async refreshBalances(){
      console.log('refreshBalances')


      this.networkBlockNumber = await this.web3Plug.getWeb3Instance().eth.getBlockNumber();

 

        var userAddress = this.web3Plug.getActiveAccountAddress(); 

 
       let contractData = this.web3Plug.getContractDataForNetworkID(this.web3Plug.getActiveNetId())
      
      
       
      let moonTokenAddress = contractData["moonmoney"].address

      
       this.currentBalances.moonmoney = await this.web3Plug.getTokenBalance(moonTokenAddress, this.web3Plug.getActiveAccountAddress())

      
       console.log('allowance', this.currentAllowances)


        let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )
 
       console.log(this.currentBalances)

        this.$forceUpdate();
    },  

          
      getMoonmoneyBalance(){
        return this.web3Plug.rawAmountToFormatted(this.currentBalances.moonmoney, CryptoAssets.assets['MoonMoney']['Decimals'])
      },

      getMoonmoneyBalanceFormatted(){
          return parseFloat( this.getMoonmoneyBalance() ).toFixed(4)
      },

  

      clickedCat(id){ 

        this.selectedCat = id; 
        
      },

      catIsSelected(){
        return (typeof(this.selectedCat) != 'undefined' )
      }


        




  }
}
</script>
