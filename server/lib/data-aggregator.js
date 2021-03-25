
  
export default class DataAggregator{


    constructor(web3, mongoInterface,serverConfig){
        this.mongoInterface = mongoInterface
        this.web3 = web3 


        setInterval(this.update,20* 1000)

    }

    update(){
        console.log('update')



    }


    //need to build a poor mans version of TheGraph using this 

    findEvents(){

        MyContract.events.MyEvent({}, { fromBlock: 0, toBlock: 'latest' }).on(
            'data', function(event) {
            console.log(event);
          }).on('error', console.error);
        

    }






}