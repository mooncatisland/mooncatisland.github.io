<template>
   <div>


      <CatIndex v-bind:ownedCats="getCatArray()" v-bind:selectedCatCallback="clickedCat" v-bind:renderSize="4" />



  </div>
</template>


<script>

 
import MoonCatTools from '../../../js/moon-cat-tools.js' 
import CatIndex from './CatIndex.vue'
 
let moonCatTools = new MoonCatTools()

export default {
  name: 'CatsPanel',
  props: ['selectedCat'],
  components:{ CatIndex  },
  data() {
    return {
        
    }
  },
  created: async function(){
 
     

  },
  mounted(){


  },
  methods: {


        getCatArray(){

          return [ {id: this.selectedCat} ]
        },
     

        clickedCat(id){

        }




  }
}
</script>
