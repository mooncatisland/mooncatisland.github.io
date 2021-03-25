


import TinyFox from 'tinyfox'

export default class DataAggregator{


    constructor(web3, mongoInterface,serverConfig){
        this.mongoInterface = mongoInterface
        this.web3 = web3 

        this.tinyFox = new TinyFox({suffix: 'development'})


        let tinyfoxConfig = {
            contractType: 'ERC20',
            contractAddress: '0xab89a7742cb10e7bce98540fd05c7d731839cf9f' ,
            startBlock: 1316824 
        } 

        this.tinyFox.startIndexing( this.web3, tinyfoxConfig )  
         

    }
 

 




}