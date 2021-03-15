<template>
  <div class=" ">
     

     <canvas v-for="item in ownedCats" v-bind:id="'catscanvas_'+item.id" v-bind:width="getCanvasSize()" v-bind:height="getCanvasSize() " class="cursor-pointer hover:bg-gray-700 m-2" @click="clickedCat(item.id)"  > </canvas> 
        

  </div>
</template>


<script>

 
import MoonCatTools from '../../../js/moon-cat-tools.js' 

let moonCatTools = new MoonCatTools()

//need to WATCH owned cats 
export default {
  name: 'CatIndex',
  props: ['ownedCats','selectedCatCallback', 'renderSize'],
  data() {
    return {
     
    }
  },
  watch: {
    ownedCats: function (val) {
        this.generateCatsForCanvas(  )
    } 
  },

  created: async function(){
 
     

  },
  mounted(){
         this.generateCatsForCanvas(  )

  },
  methods: {

      getCanvasSize(){
          return 24*this.renderSize
      },
   
      generateCatsForCanvas(){
         console.log('gen',  this.ownedCats)
 
 
          for(let index in this.ownedCats){
            let cat = this.ownedCats[index]
 
           
            this.generateMoonCatImage(cat.id , this.renderSize )
          }
      },

        generateMoonCatImage(catId, size, catOffset){
            console.log('meow', catId)
            size = size || 10;
            var data = moonCatTools.generateMoonCatImage(catId);
            var canvas = document.getElementById("catscanvas_".concat(catId));

            console.log('meep canvas', canvas)
 
            var ctx = canvas.getContext("2d");


           console.log('meow', data)


            for(var i = 0; i < data.length; i++){
              for(var j = 0; j < data[i].length; j++){
                var color = data[i][j];
                if(color){
                  ctx.fillStyle = color;
                  ctx.fillRect(i * size  , j * size  , size, size);
                }
              }
            }
          },


          clickedCat(id){
            console.log('clicked cat', id )

            this.selectedCatCallback(id)
          }


        




  }
}
</script>
