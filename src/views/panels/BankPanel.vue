
<template>
    <div class="bg-gray-800 px-8 py-2">

      <div>
      <h3 class="text-lg font-bold   text-white"> The Moonbank </h3>
     
      <div class="text-xs      text-gray-300"> Earn interest on your mineable tokens! </div>

     

      </div>



      <div v-if="networkProviderIdError" class="p-8 bg-red-200">
        {{networkProviderIdError}}
      </div>





      <div v-if="connectedToWeb3() " >


          <div class="flex flex-row pt-8 text-white text-md"   >

            <div class="p-4  w-full text-center  ">
               ETH: {{  web3Plug.rawAmountToFormatted(currentBalances.eth, cryptoAssets.assets['ETH']['Decimals'])  }}
            </div>

            <div class="p-4  w-full text-center relative ">

              <div class="absolute" style="right: 25px; top:-5px"  >
               


              </div>

               Deposited (Est. ETH Value): {{  web3Plug.rawAmountToFormatted(currentBalances.calcEthFromLP, cryptoAssets.assets['ETH']['Decimals'])  }}
            </div>

          </div>


        <div  class="mb-12">

         
         <div class="mt-12 flex flex-row w-full" v-if="depositAsset">
              <div @click="approveTokenForMoonbank" class="flex-grow cursor-pointer bg-green-400 hover:bg-green-500 border-2 border-gray-300 p-4 m-4 text-center text-gray-100 font-bold">
              Approve {{depositAsset.name}}
              </div>

              <div @click="stakeTokenForMoonbank" class="flex-grow cursor-pointer bg-green-400 hover:bg-green-500 border-2 border-gray-300 p-4 m-4 text-center text-gray-100 font-bold">
              Deposit {{depositAsset.name}}
              </div>


          </div>

        </div>

        <div class="m-4">
          <div v-if="txError">{{txError}}</div>

        </div>



      </div>



      <div v-if="connectedToWeb3() " >


        


        <div  class="mb-12">

          


          


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

 

import Web3Plug from '../../js/web3-plug.js'

export default {
  name: 'BankPanel',
  props: [ 'web3Plug' ], 
  components:{  },
  data() {
    return {
     // activeAccountAddress: null,
      providerNetworkID: null,

      currentBalances: {} , 
      cryptoAssets: CryptoAssets, 

      depositAsset: {},

      txError: null,

      networkProviderIdError: null
    }
  },
 async  mounted()
  {

     let contractData = this.web3Plug.getContractDataForNetworkID( this.web3Plug.getActiveNetId() )


    this.depositAsset.name = "0xBTC"
    this.depositAsset.address = contractData['0xbitcoin'].address
   




    this.refreshBalances()
    setInterval(this.refreshBalances, 10*1000);
 
  },
  updated()
  {

    //this.updateAll();
  },
  methods: {


   async refreshBalances(){

    //  let contractData = Web3Plug.getContractDataForNetworkID(this.providerNetworkID)

     

    },


   
 

  async  refreshWeb3Accounts(){
      if ( window.ethereum.selectedAddress) {
        this.providerNetworkID = await Web3Plug.getProviderNetworkID();
        this.activeAccountAddress = window.ethereum.selectedAddress

          console.log('this.activeAccountAddress ',this.activeAccountAddress )

          this.refreshBalances()
      }

    },

    connectedToWeb3(){
      console.log('conn', this.web3Plug.getActiveAccountAddress())
      return this.web3Plug.getActiveAccountAddress() != null
    },

 


    checkNetworkProviderIdValid(){

        if(this.providerNetworkID !=  1 )
        {
          this.networkProviderIdError = "Please switch your Web3 Provider to Ethereum Mainnet to call these methods."
          return false
        }

 
      return true;
    },

    getEtherscanBaseURL(){
        if(this.providerNetworkID == 42){
          return  'https://kovan.etherscan.io'
        }

        return 'https://etherscan.io'
    },

 

       async approveTokenForMoonbank(){

         let networkId = this.providerNetworkID

         var userAddress = this.activeAccountAddress;

         const UnlimitedAmount = 100000000
         var amtRaw  = Web3Plug.formattedAmountToRaw(UnlimitedAmount, CryptoAssets.assets['0xBTC']['Decimals']);

         let contractData =  Web3Plug.getContractDataForNetworkID(networkId)

         let tokenAddress = contractData["0xbitcoin"].address

         var tokenContract = await Web3Plug.getTokenContract(web3,tokenAddress)

         var zapInContractAddress = contractData["uniswapv2add"].address

         tokenContract.methods.approve(zapInContractAddress,amtRaw).send({from: userAddress })
         .then(function(receipt){
           console.log(receipt)

           this.refreshWeb3Accounts()
             // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
         }.bind(this));




       },

 



      ///Need approval 
        async stakeTokenForMoonbank()
        {
          let networkId = this.providerNetworkID


          var userAddress = this.activeAccountAddress;
          var amtRaw  = Web3Plug.formattedAmountToRaw(this.zapInZXBTCAmount, CryptoAssets.assets['0xBTC']['Decimals']);

          console.log('zap in 0xBTC!', userAddress, amtRaw)

          var zapInContract = await Web3Plug.getZapInContract( window.web3, Web3Plug.getWeb3NetworkName( networkId ) );

           const wethContractAddress = Web3Plug.getContractDataForNetworkID(networkId)["weth"].address
          const zxbtcContractAddress = Web3Plug.getContractDataForNetworkID(networkId)["0xbitcoin"].address// "0xb6ed7644c69416d67b522e20bc294a9a9b405b31"

          var tokenAddress =  zxbtcContractAddress
          var marketPairAddress = Web3Plug.getContractDataForNetworkID(networkId)["0xbitcoinmarketpair"].address



          //should this be 0.45 multiplier ??
          var swapQuote = await Web3Plug.get0xSwapQuote('ETH', zxbtcContractAddress,  amtRaw , this.providerNetworkID);
          var swapData = swapQuote.data

          var allowanceTarget = swapQuote.to
          var swapTarget = swapQuote.to

          var minPoolTokens = 0 // for now -- helps against front running
          let tokensAmount =  swapQuote.sellAmount

          zapInContract.methods.ZapIn(tokenAddress,marketPairAddress, tokensAmount, minPoolTokens, allowanceTarget, swapTarget, swapData )
          .send({from: userAddress })
          .then(function(receipt){
            console.log(receipt)
            this.refreshWeb3Accounts()
              // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
          }.bind(this));




        },


 



  }
}

</script>
