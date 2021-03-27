    const arryData2 = 
      { 
        displayElementMdcdrgpx:false,
        displayElementMdcdrgdx:false,
        displayElementicd10primarypx:false,
        displayElementicd10primarydx:false,
        displayElementicd10anypx:false,
        displayElementicd10anydx:false,
        displayElementhpcs:false,
        displayElementapc:false,
        displayElementhippsInpa:false,
        displayElementhippsHome:false,
        displayElementRefferalsByqhcp:false ,
        displayElementRefferalsByqgrp:false, 
        displayElementRefferalsByqhco:false ,
        displayElementRefferalsByyearhcp:false, 
        displayElementRefferalsByyeargrp:false,
        displayElementRefferalsByyearhco:false,
        displayElementReceivedhcp:false,
        displayElementReceivedhcpyear:false,
        displayElementindustryhcp:false,
        displayElementworkload:false,
        displayElementexperiencebyquarter:false,
        displayElementexperiencebyquarterhco:false,
        displayElementexperiencebyquartergrp:false
      }
    
    const res = this.getKeys(arryData2 ,/displayElementMdcdrgpx/); 
    const result = Object.keys(arryData2).map((key) =>  JSON.parse(`{ "${key}":"${arryData2[key]}"}`) );    
    const castValue = Object.keys(res).map((key) =>  JSON.parse(`{ "${key}":"true"}`)).shift()
    let data = [
      ...result,
      castValue
    ]  
    let myobject = {}
  
    for (let value of data) {        
       Object.keys(value).map((key) => myobject[`${key}`] =  (value[key] === 'true'))      
    }
    console.log("object original = ",arryData2)
    console.log("object change   = ",myobject)

  }

  getKeys  = (myvalue , pattern ) => {          
    let filtered_keys = function(obj, filter) {
       let keys = [];
      for (let key of Object.keys(obj)){
        if (obj.hasOwnProperty(key) && filter.test(key)) {
          keys.push(key);
        }
      }

     const filtered = Object.keys(myvalue)
      .filter(key => keys.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: myvalue[key]
        };
      }, {});

      return filtered;
    }
    return filtered_keys(myvalue, pattern); 
  }
