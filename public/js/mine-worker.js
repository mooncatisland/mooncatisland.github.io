var window = {}
importScripts('sha3.min.js');
var sha3 = window;

function hexToBytes(hex){
    var result = []
    for(var i = 0; i < 64; i+=2){
	result.push(parseInt(hex.slice(i, i+2),16));
    }
    return result;
}

var searchSeed;

function bytesToHex(bytes){
    return bytes.map(function(x){return ("0" + x.toString(16)).slice(-2)}).join("");
}

function randomSeed(){
    // return Array.from(crypto.getRandomValues(new Uint8Array(32))); // crashes chrome
    var x = new Array(32);
    for(var i = 0; i < 32; i++){
	x[i] = Math.floor(Math.random() * 256);
    }
    return x;
}

function mine(){
    var seed;
    var time = Date.now();
    var count = 0;
    var startTime = Date.now();
    var hash;
    while(true){
	count++;
	seed = randomSeed();
	hash = sha3.keccak256(seed.concat(searchSeed));
	if(hash.slice(0,6) == "000000"){
	    var seedHex = bytesToHex(seed);
	    break;
	}
    }
    var rawTime = (Date.now() - startTime)/1000
    var time = Math.floor(rawTime);
    var khs = count/rawTime/1000;
    var catId = "0x00" + hash.slice(-8);

    return {seed: "0x" + seedHex, id: catId, time: time, hash: hash, rate: khs+" Kh/s"}
 

  //  return ["0x" + seedHex, catId, time, hash, khs +" Kh/s"];
}

onmessage = function(e){
    searchSeed = hexToBytes(e.data);
     var result = mine();
     postMessage(JSON.stringify(result));
}