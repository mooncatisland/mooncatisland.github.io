<template>
  <div class="bg-gray-800 px-8 py-2">
     
       

       <div class="flex flex-row mb-8">
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
  <hr> 
   <div class="flex flex-col my-8 "  >

    <div v-if="!spaceProgramDetails.active"> 
      <div class="text-xl text-green-400">No Space Program Found</div>
      <p class="text-gray-200 text-sm"> In order to find new Moontoys for your cats, you have to search for them during a Space Program. </p>
       <p class="text-gray-200 text-sm"> A Space Program lasts for a period of {{spaceProgramBlocks}} blocks. During this time, you can scan for new toys.  You must claim a toy before the Space Program is over or else the mission is a failure. </p>
       
       <div class="flex flex-row mt-8  "  >
         <div class="flex-grow  text-green-400">Space Program Cost: <span class="text-white">{{getSpaceprogramCostFormatted()}}</span> 🌕 </div>
          <div class="flex-grow">  

           <div v-if="!hasApprovalForMoonTokens()" @click="approveTokenForMoontoys()" class="bg-green-400 hover:bg-green-700 text-black p-2 rounded inline cursor-pointer select-none"> Approve Moonmoney </div>  
           
            <div v-if="hasApprovalForMoonTokens()" @click="startSpaceProgram()" class="bg-green-400 hover:bg-green-700 text-black p-2 rounded inline cursor-pointer select-none"> Start a Space Program </div>  
             

            
         </div>
       </div>

     </div>



    <div v-if="spaceProgramDetails.active"> 
      <div class="text-xl text-green-400">Space Program Active</div>
      <div class="text-sm text-white">Block {{networkBlockNumber}} / {{spaceProgramDetails.spaceProgramExpiresBlock}}</div>
      <div class="text-sm text-white"> [ {{spaceProgramDetails.blocksRemaining}} blocks remain ]</div>

      <div class="whitespace-md"></div>

      <div v-if="scanningDetails.active">  

          Planet Image 


      </div>


       <div v-if="!scanningDetails.active"> 
        <div class="w-full text-center">
          <div @click="startScanning()" class="bg-green-400 text-white inline rounded p-2 cursor-pointer select-none"> Scan for Moon Toys </div>
        </div>

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
const MoonToysABI = require('../../contracts/MoonToys.json')


import Miner from '../../js/spacelaunch/miner.js'
 
var os = require('os')


let moonCatTools = new MoonCatTools()

export default {
  name: 'CatsPanel',
  props: ['web3Plug'],
  components:{CatIndex,CatProfile},
  data() {
    return {
      currentBalances: {}  ,
      currentAllowances: {} ,
      spaceProgramBlocks: 500,
      spaceProgramCost: 100,
      spaceProgramDetails: { },
      scanningDetails: {scanActive:false},
      networkBlockNumber: null,
      scanningMiner: null 
    }
  },
  created: async function(){

       this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        
        
      }.bind(this));


      this.scanningDetails.cpucores =  os.cpus().length;

      
     

  },
  mounted: async function(){

    await this.refreshBalances()
    setInterval(this.refreshBalances, 10*1000);

    //this is required due to using the formatting method 
     this.$forceUpdate();

  },
  methods: {


      

  async  refreshWeb3Accounts(){
      if ( this.web3Plug.connectedToWeb3() ) {
          
          this.refreshBalances()
      }

    },



     async refreshBalances(){
      console.log('refreshBalances')


      this.networkBlockNumber = await this.web3Plug.getWeb3Instance().eth.getBlockNumber();

 

        var userAddress = this.web3Plug.getActiveAccountAddress(); 

 
       let contractData = this.web3Plug.getContractDataForNetworkID(this.web3Plug.getActiveNetId())
      
      
       
       let moonTokenAddress = contractData["moonmoney"].address
       let moonToysAddress = contractData["moontoys"].address

      
       this.currentBalances.moonmoney = await this.web3Plug.getTokenBalance(moonTokenAddress, this.web3Plug.getActiveAccountAddress())

       this.currentAllowances.moonmoney = await this.web3Plug.getTokenAllowance(moonTokenAddress, moonToysAddress, this.web3Plug.getActiveAccountAddress())

      
      


       let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )
       let moonToysContract = this.web3Plug.getCustomContract(MoonToysABI, moonToysAddress )

       this.spaceProgramCost = await moonToysContract.methods.SpaceProgramCost().call()
       this.spaceProgramBlocks = await moonToysContract.methods.SpaceProgramMaxBlockTime().call()
       
       this.spaceProgramDetails.active = await moonToysContract.methods.spaceProgramIsActiveForUser(userAddress).call() 
       let spaceProgramData = await moonToysContract.methods.spacePrograms(userAddress).call() 


       this.spaceProgramDetails.spaceProgramExpiresBlock = parseInt(spaceProgramData.programStartBlock) + parseInt(this.spaceProgramBlocks)
       this.spaceProgramDetails.blocksRemaining =   this.spaceProgramDetails.spaceProgramExpiresBlock - this.networkBlockNumber 
       this.spaceProgramDetails.spaceProgramChallenge = spaceProgramData.challenge

        console.log('space progrms', this.spaceProgramDetails)
         console.log('allowance', this.currentAllowances)
       console.log('balance', this.currentBalances)

       this.$forceUpdate();
    },  



       async approveTokenForMoontoys(){

         let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 1000000000000000000000000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address

         
         let web3 = this.web3Plug.getWeb3Instance()
         

        var moonBankContractAddress = contractData["moonmoney"].address
         var moonToysContractAddress = contractData["moontoys"].address


         var tokenContract =  this.web3Plug.getTokenContract(  moonBankContractAddress )

         
         console.log( tokenContract )

         tokenContract.methods.approve(moonToysContractAddress,amtRaw).send({from: userAddress })
         .then(function(receipt){
           console.log(receipt)

           this.refreshWeb3Accounts()
             // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
         }.bind(this));
 


       },

  
      async startSpaceProgram(){

        console.log('startSpaceProgram')
        
          let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 100000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         
         let moonToysAddress = contractData["moontoys"].address


         let moonToysContract = this.web3Plug.getCustomContract(MoonToysABI, moonToysAddress )


         let stakeAmountRaw = this.web3Plug.formattedAmountToRaw(this.tokenAmountToStakeFormatted, CryptoAssets.assets['0xBTC']['Decimals'])

         await moonToysContract.methods.startSpaceProgram(   ).send({from: userAddress})


      },



          
      getMoonmoneyBalance(){
        return this.web3Plug.rawAmountToFormatted(this.currentBalances.moonmoney, CryptoAssets.assets['MoonMoney']['Decimals'])
      },

      getSpaceprogramCostFormatted(){
        return parseFloat( this.web3Plug.rawAmountToFormatted(this.spaceProgramCost, CryptoAssets.assets['MoonMoney']['Decimals'])).toFixed(4)
      },

      getMoonmoneyBalanceFormatted(){
          return parseFloat( this.getMoonmoneyBalance() ).toFixed(4)
      },




      getExternalMoonMoney(){
        return  this.web3Plug.rawAmountToFormatted(this.currentBalances.moonmoney, CryptoAssets.assets['MoonMoney']['Decimals'])

       },


     getApprovedMoonMoney(){
        let external =   this.getExternalMoonMoney()

        let approval =   this.web3Plug.rawAmountToFormatted(this.currentAllowances.moonmoney, CryptoAssets.assets['MoonMoney']['Decimals'])

        return Math.min(external ,  approval) 

     },


      hasApprovalForMoonTokens(){
        console.log('meep',this.getApprovedMoonMoney() ,  this.getExternalMoonMoney())
        return (this.getApprovedMoonMoney() >= this.getExternalMoonMoney())
      },

        
      async startScanning(){
       

        this.scanningDetails.scanActive = true 
        this.scanningDetails.scanStartTime = Date.now()

         console.log('start scanning', this.scanningDetails)

        let searchseed = this.spaceProgramDetails.spaceProgramChallenge

        this.scanningMiner = new Miner(searchseed)


        let output = await new Promise((resolve, reject) => {
          this.scanningMiner.mine(1, function(result){
             
            resolve(result)
          })
        })
        
          this.scanningDetails.scanActive = false
          this.scanningDetails.output = output 

           console.log('results of mining', output )
 

       
        //when this finds a good number, set scanningComplete to finished , allow user to either scan again or submit the claim to end the program 
      }



  }
}
</script>
