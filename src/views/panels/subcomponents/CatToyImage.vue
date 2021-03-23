<template>
  <div class=" ">
     

     <canvas class="pixelfriendly" ref="iconCanvas" v-bind:width="renderSize" v-bind:height="renderSize"> 
         
     </canvas> 
        

  </div>
</template>


<script>
  

//need to WATCH owned cats 
export default {
  name: 'CatToyImage',
  props: ['iconId','clickedIconCallback', 'renderSize'],
  data() {
    return {
     
    }
  },
  watch: {
    
    iconId: function ( ) {
        this.renderIcon( )
    }
  },

  created: async function(){
       // this.renderSize = 64
     

  },
  mounted(){
    
      this.renderIcon( )

  },
  methods: {

     
       
          clickedIcon(id, image){
            console.log('clicked icon', id )

            this.clickedIconCallback(id)
          },

          renderIcon( ) {

            var canvas = this.$refs.iconCanvas  
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            console.log('render!')

            let iconId = this.iconId
            let iconDimension = 32;

            let renderSize = this.renderSize

            let cols = 5
            let rows = 8

            let x_index = Math.floor(iconId / cols);
            let y_index = Math.floor(iconId % cols);

            console.log('indices',x_index, y_index)

            const image = new Image(64, 64);
            image.onload = function drawImageActualSize() {
                            console.log('draw!')
                            

                            ctx.drawImage(this, -renderSize * y_index, -renderSize * x_index, renderSize*cols, renderSize*rows);
                            }
        

            image.src = '/documents/img/moontoys.png';
          }


        




  }
}
</script>
