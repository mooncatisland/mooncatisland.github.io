
var workers = [];

var searchSeed;
export default class Miner{


		constructor(sseed){
			if(sseed.slice(0,2) == "0x"){
				sseed = sseed.slice(2);
			}
			searchSeed = sseed;
			 
			
		}


		mine(workerCount, handleResult){

			function terminateWorkers(){
				workers.map(function(w){
					w.terminate();
				})
				workers = [];
			}

			workerCount = workerCount || 1;
			terminateWorkers();
			workers = [];
			for (var i = 0; i < workerCount; i++){
				var w = new Worker('/js/mine-worker.js');
				w.onmessage = function(e) {
				terminateWorkers();
				var result = JSON.parse(e.data);
				handleResult(result);
				}
				workers.push(w);
				w.postMessage(searchSeed);
			}
		}

	 

}