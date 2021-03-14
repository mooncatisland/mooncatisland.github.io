<template>
  <div class=" ">
     <h3 class="text-lg font-bold inline text-white text-gray-700"> Mooncats </h3>


      <div v-if="ownedCats.length == 0 ">
         <div> It looks like you don't have any Mooncats! </div>
        <br> 
          <a class="m-2 p-2 bg-blue-500 text-white rounded" target="_blank" href="https://mooncatrescue.com/adopt.html"> Adopt a mooncat today  </a> 

      </div>


       <div v-if="ownedCats.length > 0 ">

         <canvas id="catscanvas" width="640" height="260"  > </canvas> 

       </div>

  </div>
</template>


<script>

const axios = require('axios')
import MoonCatTools from '../../js/moon-cat-tools.js' 

let moonCatTools = new MoonCatTools()

export default {
  name: 'CatsPanel',
  props: ['web3Plug'],
  data() {
    return {
      ownedCats: [] 
    }
  },
  created: async function(){

       this.web3Plug.getPlugEventEmitter().on('stateChanged', async function(connectionState) {
        await this.loadCatsForAddress( this.web3Plug.getActiveAccountAddress() )
        this.generateCatsForCanvas(  )
      }.bind(this));

      await this.loadCatsForAddress( this.web3Plug.getActiveAccountAddress() )
      this.generateCatsForCanvas(  )

  },
  mounted(){


  },
  methods: {
      async loadCatsForAddress(userAddress){
          console.log('load cats for ', userAddress)

         this.ownedCats = [] 

        let catsarray = await new Promise ((resolve, reject) => {
             

          axios.post('https://api.thegraph.com/subgraphs/name/tibike6/mooncatrescue', {
                  query: `
                  {
                    owners(where:{id:"`+userAddress+`"}) {
                      id
                      cats {
                        id
                      }
                    
                    }
                  }  
                  `
                })
                .then((res) => {
                  
                    console.log(res.data)

                    let results = res.data

                    let owner = results.data.owners[0]

                    if(!owner)return 
 
                  
                    resolve(owner.cats)
                })
                .catch((error) => {
                  console.error(error)
                  reject(error)
                })




          })

        this.ownedCats = catsarray 
            console.log('cats are', this.ownedCats)



      },

      generateCatsForCanvas(){
         console.log('gen',  this.ownedCats)

          let catSize = 4;
          let catsPerRow = 5;


          for(let index in this.ownedCats){
            let cat = this.ownedCats[index]

            let row = Math.floor( index / catsPerRow ) ;
            let col =  Math.floor(  index  % catsPerRow ) ;
           
            this.generateMoonCatImage(cat.id, catSize, {x: col*22*catSize , y: row*22*catSize})
          }
      },

        generateMoonCatImage(catId, size, catOffset){
            console.log('meow', catId)
            size = size || 10;
            var data = moonCatTools.generateMoonCatImage(catId);
            var canvas = document.getElementById("catscanvas");
          //  canvas.width = size * data.length;
          //  canvas.height = size * data[1].length;
            var ctx = canvas.getContext("2d");


           console.log('meow', data)


            for(var i = 0; i < data.length; i++){
              for(var j = 0; j < data[i].length; j++){
                var color = data[i][j];
                if(color){
                  ctx.fillStyle = color;
                  ctx.fillRect(i * size +catOffset.x, j * size +catOffset.y, size, size);
                }
              }
            }
          }




  }
}
</script>
