<template>
  <div class="bg-gray-800 px-8 py-2">
     


      <div v-if="ownedCats.length == 0 " class="p-4" v-cloak>
         <div class="text-white"> You have not rescued any Mooncats on Ethereum Mainnet! </div>
        <br> 
          <a class="m-2 p-2 bg-blue-500 text-white rounded" target="_blank" href="https://mooncatrescue.com/adopt.html"> Adopt a mooncat today  </a> 

      </div>


       <div v-if="ownedCats.length > 0 ">

         <div v-if=" !catIsSelected() ">
              <h3 class="text-lg font-bold inline text-white "> Mooncats </h3>
             <CatIndex v-bind:ownedCats="ownedCats" v-bind:selectedCatCallback="clickedCat" v-bind:renderSize="2" />
         </div>

         <div v-if="catIsSelected()  ">
             
             <CatProfile v-bind:selectedCat="selectedCat" />
           
         </div>

       </div>

  </div>
</template>


<script>

const axios = require('axios')
import MoonCatTools from '../../js/moon-cat-tools.js' 
import CatIndex from './subcomponents/CatIndex.vue'
import CatProfile from './subcomponents/CatProfile.vue'

import TheGraphHelper from '../../js/thegraph-helper.js'

let moonCatTools = new MoonCatTools()

export default {
  name: 'CatsPanel',
  props: ['web3Plug'],
  components:{CatIndex,CatProfile},
  data() {
    return {
      ownedCats: [] ,
      selectedCat: undefined
    }
  },
  created: async function(){

       this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        await this.loadCatsForAddress( this.web3Plug.getActiveAccountAddress() )
        
      }.bind(this));

      await this.loadCatsForAddress( this.web3Plug.getActiveAccountAddress() )
     

  },
  mounted(){


  },
  methods: {
      async loadCatsForAddress(userAddress){
          console.log('load cats for ', userAddress)

         this.ownedCats = await TheGraphHelper.findMooncatsOwnedBy(userAddress)

        
         console.log('cats are', this.ownedCats)



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
