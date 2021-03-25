 
import MongoInterface from './lib/mongo-interface.js'
import DataAggregator from './lib/data-aggregator.js'
 

import FileHelper from './lib/file-helper.js'
 

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

  async function start(){

    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( 'mooncatisland_'.concat(envmode) ) 


    let web3 = new Web3( serverConfig.web3provider  )
    console.log('web3 ready with provider ',serverConfig.web3provider )

    let dataAggregator = new DataAggregator(web3, mongoInterface,serverConfig)
 


}

 
 start()