
import sha256 from 'crypto-js/sha256';
 
const toyNames = {
	0: "yarn",
	1: "leaf",
	2: "ball",
	3: "laserpointer",
	4: "rope",
	5: "blanket",
	6: "mouseplushie",
	7: "tunasnack",
	8: "unicornplushie",
	9: "sushiplushie",
	10: "ghostplushie",
	11: "balloon",
	12: "minershelmet",
	13: "batterycell",
	14: "aviatorgoggles",
	15: "telescope",
	16: "solarpanel",
	17: "box",
	18: "laserblaster",
	19: "beaniehat",
	20: "mittens",
	21: "socks",
	22: "geckoplushie",
	23: "lavalamp",
	24: "sombrero",
	25: "rhastahat",
	26: "supercape",
	27: "gameconsole",
	28: "eyepatch",
	29: "partyhat",
	30: "spectacles",
	31: "zombieplushie",
	32: "boombox",
	33: "microchip",
	34: "sunglasses",
	35: "pirateflag",
	36: "dice",
	37: "umbrella",
	38: "beachchair",
	39: "kittenplushie"
}


const toyAttributes = {
	0: "undead",
	1: "haunted",
	2: "magic",
	3: "enchanted",
	4: "radioactive",
	5: "chewed",
	6: "damaged",
	7: "fake"
} 



 

export default class MoonToys {





 constructor(){
   

 }

    static getToyDetails(toyId){
		let iconId = MoonToys.ToyIdToIconId(toyId)
		let name = MoonToys.IconIdToName(iconId)
		let attribute = MoonToys.ToyIdToAttribute(toyId)

		return {
			iconId: iconId,
			name: name,
			attribute: attribute,
			fullName: MoonToys.getFullName(toyId)


		}
	}

	static ToyIdToIconId(toyId) { 
	  toyId = parseInt(toyId)

	  let iconId = toyId % 40;

	  return iconId 
  	}

	  static getFullName(toyId){
		let iconId = MoonToys.ToyIdToIconId(toyId)
		let name = MoonToys.IconIdToName(iconId)
		let attribute = MoonToys.ToyIdToAttribute(toyId)

		if(attribute){
			return attribute.concat(' ').concat(name)
		}
		return name 

	  }



    static IconIdToName(iconId) {  
		return toyNames[iconId] 
    }

	static ToyIdToAttribute(toyId) { 
		  toyId = parseInt(toyId) 
		const hashDigest = sha256(toyId);

		console.log( hashDigest )

		let attributeId = parseInt(hashDigest, 16) % 100;  
		return toyAttributes[attributeId] 
    }

 
 

}
 