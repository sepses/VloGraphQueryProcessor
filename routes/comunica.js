var express = require('express');
var router = express.Router();
const cors = require('cors');
var comunica = require('@comunica/actor-init-sparql');
const engine = comunica.newEngine();

router.use(cors());
router.post('/', (req, res, next) => {
    var queryString=req.body.queryString;
    var endpoint=req.body.endpoint;
    //console.log(endpoint);
    var bgk=req.body.bgk;
    var bgk_tpf=req.body.bgk_tpf;
   
    handleData(queryString,endpoint,bgk,bgk_tpf).then(result => {
        res.set('content-type', 'text/plain; charset=utf-8');
        res.send(result);
    });
});
async function handleData (queryString,endpoint,bgk,bgk_tpf) {
    const query = queryString;
    const sources = [];
    
    // add endpoint
    if(endpoint!=""){
        var ep=endpoint.split(",");
             for(var k=0;k<ep.length;k++){
                sources.push({type:"sparql",value:ep[k]});
             }
             
     }      
     
    //add bgk to source
     
    if(bgk!=""){
       var bgks=bgk.split(",");
       bgks.forEach(bgksFunction);
       function bgksFunction(item) {
        sources.push({type:"sparql",value:item});
       }
    }
    
    if(bgk_tpf!=""){
        var bgk_tpfs=bgk_tpf.split(",");    
            for(var j=0;j<bgk_tpfs.length;j++){
                sources.push({type:"hypermedia",value:bgk_tpfs[j]});
            }
        
    }
        
        // console.log(source_bgk);
    // console.log(source_bgktpf);
    
     console.log(sources);
    // const sources = [
    //     { type: "sparql", value: endpoint },
    //     { type: "hypermedia", value: "https://fragments.dbpedia.org/2016-04/en" },
    //     //{ type: "sparql", value: "http://dbpedia.org/sparql" },
    // ];
    const result = await engine.query(query, { sources });
    //console.log(result);
    const results = [];
    result.bindingsStream.on('data', (data) =>// {
        //console.log(data.toObject()));
          results.push(data.toObject()));
        
    //});
    return new Promise(resolve => {
        result.bindingsStream.on('end', () => {
            resolve(results);
        })
    });
}

module.exports = router;
