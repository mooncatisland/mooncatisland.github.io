<template>
  <div class="bg-gray-800 px-8 py-2">
     
       <h3 class="text-lg font-bold inline text-white "> Mooncat Island Space Program </h3>

      <div v-if="ownedCats.length == 0 " v-cloak>
        
      </div>



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

      


    
  </div>
</template>


<script>

const axios = require('axios')
import MoonCatTools from '../../js/moon-cat-tools.js' 
import CatIndex from './subcomponents/CatIndex.vue'
import CatProfile from './subcomponents/CatProfile.vue'

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

      

          clickedCat(id){ 

            this.selectedCat = id; 
            
          },

          catIsSelected(){
            return (typeof(this.selectedCat) != 'undefined' )
          }


        




  }
}
</script>
