
<template>
    <div class="bg-gray-800 px-8 py-2">


      


      <div class="flex flex-row">
        <div class="flex-grow">
          <h3 class="text-lg font-bold   text-white"> The Moonbank </h3>
        
          <div class="text-xs      text-gray-300"> Earn interest on your mineable tokens! </div>
        </div>
        <div class="flex-grow text-black  text-center">
          <div class="w-full bg-yellow-200 rounded">
                 Moonmoney: {{  getMoonmoneyBalanceFormatted()  }}  🌕

           </div>
                 <div class="w-full bg-gray-900 text-orange-500  rounded">
                 Staked 0xBTC: {{ getStakedZxBTC()  }}  ⛏️ 

           </div>

          
          </div>

      </div>



      <div v-if="networkProviderIdError" class="p-8 bg-red-200">
        {{networkProviderIdError}}
      </div>


    


      <div v-if=" web3Plug.connectedToWeb3()  " >

             <p class="text-gray-200 p-8 m-2 text-sm ">
              When you deposit your 0xBTC in the MoonMoney smart contract, you immediately earn 1 MoonMoney for each deposited 0xBTC.  Your 0xBTC is then locked safely inside of the smart contract until {{ getExpectedVaultExpirationTime() }} blocks have passed.  Then, you can take it out and do it all over again!
              </p>

          
          
          <div class="flex flex-row pt-8 text-white text-md"   >

            <div class="flex flex-col  w-full">
                <div class="p-4  w-full text-center  ">
                  External 0xBTC: {{ getExternalZxBTC()  }}
                </div>

                <div class="p-4  w-full text-center  ">
                  
                </div>
            </div>

            <div class="p-4  w-full text-center relative ">

              <div class="absolute" style="right: 25px; top:-5px"  >
               


              </div>
                 Approved 0xBTC: {{  getApprovedZxBTC()  }}
              
            </div>

          </div>


        

         
         <div class="mt-12 flex flex-row w-full" v-if="depositAsset && !hasApprovalForDepositToken()">
              <div @click="approveTokenForMoonbank" class="flex-grow cursor-pointer bg-green-400 hover:bg-green-500 border-2 border-gray-300 p-4 m-4 text-center text-gray-100 font-bold">
              Approve {{depositAsset.name}}
              </div>

             


          </div>


           <div class="mt-12 flex flex-row w-full" v-if="depositAsset && hasApprovalForDepositToken()">
              <div  class=" flex-grow p-4">
                <input v-model="tokenAmountToStakeFormatted" class="w-full p-4    "> </input> 
              </div>

              <div @click="stakeTokenForMoonbank" class="flex-grow cursor-pointer bg-green-400 hover:bg-green-500 border-2 border-gray-300 p-4 m-4 text-center text-gray-100 font-bold">
              Deposit {{depositAsset.name}}
              </div>


          </div>

       

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

        </div>



      </div>

        <hr> 

      <div v-if=" web3Plug.connectedToWeb3() " >
            <p class="text-gray-200 p-8 m-2 text-sm ">
              The vaultlock expires in {{ getExpectedVaultExpirationTime() }} blocks.  After the vaultlock has expired, you can restake the tokens for more MoonMoney or withdraw them.

              </p>

          <div class="flex flex-row pt-8 text-white text-md"   >

            <div class="p-4  w-full text-center  ">
               
               Vaultlock Expiration Block: {{ getVaultExpirationBlock() }}


            </div>

            <div class="p-4  w-full text-center relative ">

                
                Blocks until Expiry: {{ getVaultExpirationTime() }}
               
            </div>

          </div>


        <div  class="mb-12"></div>

          

        <div class="mt-12 flex flex-row w-full" v-if="depositAsset">
              
              <div @click="restakeTokenForMoonbank" 
              class="flex-grow cursor-pointer  border-2 border-gray-300 p-4 m-4 text-center text-gray-800 font-bold"
              :class="{'bg-gray-700 hover:bg-gray-500  text-red-300':  !getVaultIsUnlocked(), 'bg-green-400 hover:bg-green-500':  getVaultIsUnlocked()  }"
              >
             
              Restake Locked {{depositAsset.name}}
              </div>

             <div @click="unstakeTokenFromMoonbank" 
            class="flex-grow cursor-pointer  border-2 border-gray-300 p-4 m-4 text-center text-gray-800 font-bold"
              :class="{'bg-gray-700 hover:bg-gray-500 text-red-300':  !getVaultIsUnlocked(), 'bg-green-400 hover:bg-green-500':  getVaultIsUnlocked()  }"
              >
              Withdraw {{depositAsset.name}}
              </div>
             


          </div>

          


        

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

        </div>



      </div>








    </div>
</template>

<script>

const Web3 = require('web3')

var BN = Web3.utils.BN;


const CryptoAssets = require('../../config/cryptoassets.json')

 const MoonMoneyABI = require('../../contracts/MoonMoney.json')
const axios = require('axios')


import Web3Plug from '../../js/web3-plug.js'

export default {
  name: 'BankPanel',
  props: [ 'web3Plug' ], 
  components:{  },
  data() {
    return {
      connectedToWeb3: false,

     // activeAccountAddress: null,
      providerNetworkID: null,

      currentBalances: {} , 
      currentAllowances: {},

      vaultExpirationBlock: 0,
      networkBlockNumber: 0,

      depositAsset: {},

      minimumVaultStakeTime: 0,

      tokenAmountToStakeFormatted: 0,

      txError: null,

      networkProviderIdError: null
    }
  },
   created: async function()
   {
     

      //this is required because vue cant detect changes otherwise 
     this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
      
      let contractData = this.web3Plug.getContractDataForNetworkID( this.web3Plug.getActiveNetId() )
        
          this.depositAsset.name = "0xBTC"
         this.depositAsset.address = contractData['0xbitcoin'].address
   
         console.log('this.depositAsset', this.depositAsset)
        this.refreshBalances()
        
      }.bind(this));

   /*  let contractData = this.web3Plug.getContractDataForNetworkID( this.web3Plug.getActiveNetId() )


    this.depositAsset.name = "0xBTC"
    this.depositAsset.address = contractData['0xbitcoin'].address
   

    console.log('this.depositAsset', this.depositAsset)*/
     this.web3Plug.reconnectWeb()
   },

 
  mounted: async function()
  { 
      


    await this.refreshBalances()
    setInterval(this.refreshBalances, 10*1000);

    //this is required due to using the formatting method 
     this.$forceUpdate();
  },
  updated()
  {

    //this.updateAll();
  },
  methods: {


   async refreshBalances(){
     console.log('refreshBalances')


      this.networkBlockNumber = await this.web3Plug.getWeb3Instance().eth.getBlockNumber();



      var userAddress = this.web3Plug.getActiveAccountAddress(); 


     
      let contractData = this.web3Plug.getContractDataForNetworkID(this.web3Plug.getActiveNetId())
      
      
      let zcbtcTokenAddress = contractData["0xbitcoin"].address
      let moonTokenAddress = contractData["moonmoney"].address

      
       this.currentBalances.zxbtc = await this.web3Plug.getTokenBalance(zcbtcTokenAddress, this.web3Plug.getActiveAccountAddress())
       this.currentBalances.moonmoney = await this.web3Plug.getTokenBalance(moonTokenAddress, this.web3Plug.getActiveAccountAddress())

       this.currentAllowances.zxbtc = await this.web3Plug.getTokenAllowance(zcbtcTokenAddress, moonTokenAddress, this.web3Plug.getActiveAccountAddress())

       console.log('allowance', this.currentAllowances)


      let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )


      this.currentBalances.stakedZxBTC = await moonMoneyContract.methods.getVaultBalance(  this.web3Plug.getActiveAccountAddress() ).call()

 
 
       this.vaultExpirationBlock =  await moonMoneyContract.methods.getVaultExpiration( this.web3Plug.getActiveAccountAddress() ).call({from: userAddress})
        this.minimumVaultStakeTime = await moonMoneyContract.methods.MinStakingTimeBlocks(   ).call({from: userAddress})
 


       console.log(this.currentBalances)

        this.$forceUpdate();
    },  


   
 

  async  refreshWeb3Accounts(){
      if ( this.web3Plug.connectedToWeb3() ) {
          
          this.refreshBalances()
      }

    },


    getExternalZxBTC(){
        return  this.web3Plug.rawAmountToFormatted(this.currentBalances.zxbtc, CryptoAssets.assets['0xBTC']['Decimals'])

  },

     getApprovedZxBTC(){
        let external =   this.getExternalZxBTC()

        let approval =   this.web3Plug.rawAmountToFormatted(this.currentAllowances.zxbtc, CryptoAssets.assets['0xBTC']['Decimals'])

        return Math.min(external ,  approval) 

  },

  getStakedZxBTC(){
      return this.web3Plug.rawAmountToFormatted(this.currentBalances.stakedZxBTC,CryptoAssets.assets['0xBTC']['Decimals'])
  },  
   

   getMoonmoneyBalance(){
     return this.web3Plug.rawAmountToFormatted(this.currentBalances.moonmoney, CryptoAssets.assets['MoonMoney']['Decimals'])
   },

   getMoonmoneyBalanceFormatted(){
      return parseFloat( this.getMoonmoneyBalance() ).toFixed(4)
   },


   hasApprovalForDepositToken(){

     return (this.getApprovedZxBTC() >= this.getExternalZxBTC())
   },
 

/*
    checkNetworkProviderIdValid(){

        if(this.providerNetworkID !=  1 )
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }

 
      return true;
    },*/

    getEtherscanBaseURL(){
        if(this.providerNetworkID == 42){
          return  'https://kovan.etherscan.io'
        }

        return 'https://etherscan.io'
    },

 

       async approveTokenForMoonbank(){

         let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 100000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address

         
         let web3 = this.web3Plug.getWeb3Instance()
         

         var tokenContract =  this.web3Plug.getTokenContract(  tokenAddress)

         var moonBankContractAddress = contractData["moonmoney"].address

         console.log( tokenContract )

         tokenContract.methods.approve(moonBankContractAddress,amtRaw).send({from: userAddress })
         .then(function(receipt){
           console.log(receipt)

           this.refreshWeb3Accounts()
             // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
         }.bind(this));
 


       },

 



      ///Need approval 
        async stakeTokenForMoonbank()
        {
         
         let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 100000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address
         let moonTokenAddress =  contractData["moonmoney"].address

         let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )
        

        let stakeAmountRaw = this.web3Plug.formattedAmountToRaw(this.tokenAmountToStakeFormatted, CryptoAssets.assets['0xBTC']['Decimals'])

        await moonMoneyContract.methods.stakeTokens( stakeAmountRaw ).send({from: userAddress})

  
        },

      async restakeTokenForMoonbank(){

         let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 100000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address
         let moonTokenAddress =  contractData["moonmoney"].address

         let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )
        
 
        await moonMoneyContract.methods.restakeTokens(  ).send({from: userAddress})


      },  

      async unstakeTokenFromMoonbank()
        {
         
         let networkId = this.web3Plug.getActiveNetId()

         var userAddress = this.web3Plug.getActiveAccountAddress();

         const UnlimitedAmount = 100000000
         var amtRaw  = this.web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  this.web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address
         let moonTokenAddress =  contractData["moonmoney"].address

         let moonMoneyContract = this.web3Plug.getCustomContract(MoonMoneyABI, moonTokenAddress )
        
 
        await moonMoneyContract.methods.unstakeTokens(  ).send({from: userAddress})

  
        },



      getVaultExpirationBlock(){

            return this.vaultExpirationBlock


      },  

      getVaultExpirationTime(){
  
          return Math.max( this.vaultExpirationBlock - this.networkBlockNumber , 0   )
        
      },

        getExpectedVaultExpirationTime(){

          if( this.getStakedZxBTC() == 0){

            return this.minimumVaultStakeTime
          }

  
          return Math.max( this.vaultExpirationBlock - this.networkBlockNumber , 0   )
        
      },



      getVaultIsUnlocked(){
        return (this.getVaultExpirationTime() <= 0 )

      }




  }
}

</script>
