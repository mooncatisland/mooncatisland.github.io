<template>

<div>

   <div class="section bg-world px-0 lg:px-1">

     <div class=" ">
       <Navbar 
        v-bind:web3Plug="web3Plug"
       />
     </div>


   </div>


   
    <div class="section dark   ">
     <div class="w-container pt-8 flex flex-row">

       <div class=" relative " style="width:90px"> 
          <MiniNav
           v-bind:activePanelId="activePanelId"
           v-bind:onClickedCallback="setActivePanel"
            />
        </div>

        <div class="flex-grow bg-gray-200" style="min-height:700px"  >
            

            <AppPanel
               v-bind:activePanelId="activePanelId"
               v-bind:web3Plug="web3Plug"
             />
        </div>

       

     </div>
   </div>




   <div class="section dark hidden  ">
     <div class="w-container pt-8">

       <h1>Moon cat viewer</h1>
        <h3>View Guide</h3>
        <p>If you look at your transaction history and view the first transaction you sent; under the input data if you decode the input data you see the catId which you can paste into this site created by a rescuer!</p>
        <button onclick="generateMoonCatImage(document.getElementById('catId').value,10)">Meow</button>
        <input id="catId" type="text" placeholder="Cat Id">
        <br>
            <canvas id="cat-canvas" width="100%"> </canvas>

     </div>
   </div>

 

  <Footer/>

</div>
</template>


<script>
import Navbar from './components/Navbar.vue';
import AppPanel from './components/AppPanel.vue';
import Footer from './components/Footer.vue';
import MiniNav from './components/MiniNav.vue'

import MoonCatTools from '../js/moon-cat-tools.js' 

import Web3Plug from '../js/web3-plug.js' 


const mooncatContractABI = require('../contracts/MoonCatRescue.json')

let moonCatTools = new MoonCatTools()

export default {
  name: 'Home',
  props: [

    


  ],
  components: {Navbar,AppPanel,MiniNav,Footer},
  data() {
    return {
      web3Plug: new Web3Plug(),
      activePanelId: null
    }
  },
  mounted: function () {

    this.web3Plug.reconnectWeb()

    this.web3Plug.getPlugEventEmitter().on('stateChanged', function(connectionState) {
        console.log('stateChanged',connectionState);

        // CUSTOM CODE HERE
        this.activeAccountAddress = connectionState.activeAccountAddress
        this.activeNetworkId = connectionState.activeNetworkId
        // END CUSTOM CODE

      }.bind(this));

   this.web3Plug.getPlugEventEmitter().on('error', function(errormessage) {
        console.error('error',errormessage);

        //CUSTOM CODE HERE
        this.web3error = errormessage
        // END CUSTOM CODE
      }.bind(this));


   
   //    this.generateMoonCatImage('0x0064c9c57b', 2 );
  },
  methods: {

          setActivePanel(panelId){
              if(panelId == this.activePanelId){
                this.activePanelId = null;
                return 
              }

               this.activePanelId = panelId ;
          },

         

          async scanForCatsAtAddress( ){

               let contractData = this.web3Plug.getContractDataForNetworkID(this.activeNetworkId)

            let web3 = this.web3Plug.getWeb3()

              
            let mooncatContract = this.web3Plug.getCustomContract(web3, mooncatContractABI,  contractData['mooncatrescue'].address)

            let events = await mooncatContract.getPastEvents(evt)

           /*  web3.eth.filter({
              address: contractData['mooncatrescue'].address,
              from: 1,
              to: 'latest'
            }).get(function (err, result) {
              // callback code here
              console.log('meep ', result )
            })*/

          },

          generateMoonCatImage(catId, size){
            console.log('meow', catId)
            size = size || 10;
            var data = moonCatTools.generateMoonCatImage(catId);
            var canvas = document.getElementById("cat-canvas");
            canvas.width = size * data.length;
            canvas.height = size * data[1].length;
            var ctx = canvas.getContext("2d");


           console.log('meow', data)


            for(var i = 0; i < data.length; i++){
              for(var j = 0; j < data[i].length; j++){
                var color = data[i][j];
                if(color){
                  ctx.fillStyle = color;
                  ctx.fillRect(i * size, j * size, size, size);
                }
              }
            }
          }
  }
}
</script>
