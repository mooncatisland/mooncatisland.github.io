
 
import axios from 'axios'

export default class TheGraphHelper {

 

    static async findMooncatsOwnedBy(publicAddress)
    {
         publicAddress = publicAddress.toLowerCase()
   
          let graphURL = "https://api.thegraph.com/subgraphs/name/rentft/moon-cat-rescue"
  
          let queryString = `
                          {
                    
                            owners(where:{id:"`+publicAddress+`"}) {
                              id,
                              cats {
                                id,
                                isWrapped
                              }
                              
                            }
                          }
                      `        
                             
  
                          
        let result = await TheGraphHelper.resolveGraphQuery(graphURL , queryString  )
  
        console.log('graph', result)

        if( result.data.owners.length > 0){
          let catTokens =  result.data.owners[0].cats
  
          return catTokens.map(x => ({id: x.id, needsWrap: !x.isWrapped}))
     
        }

        return []
     
  
      }
  



  static async resolveGraphQuery(graphURL, queryString){

    return new Promise(   (resolve, reject) => {

      axios.post(graphURL,{query: queryString})
      .then((res) => {
         
           console.log(res.data)
           let results = res.data
          
     
            resolve(results)

       }) .catch((error) => {
           console.error(error)
           reject(error)
       })

   }); 

  }


}
