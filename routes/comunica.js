var express = require('express');
var router = express.Router();
const cors = require('cors');
//var comunica = require('@comunica/actor-init-sparql-file');
var comunica = require('@comunica/actor-init-sparql-hdt');
const engine = comunica.newEngine();

router.use(cors());
router.post('/', (req, res, next) => {
    var queryString=req.body.queryString;
    var endpoint=req.body.endpoint;
    //console.log(endpoint);
    var bgk=req.body.bgk;
    var bgk_tpf=req.body.bgk_tpf;
    var bgk_file=req.body.bgk_file;
   
    handleData(queryString,endpoint,bgk,bgk_tpf,bgk_file).then(result => {
        //console.log(result);
        res.set('content-type', 'text/plain; charset=utf-8');
        res.send(result);
    });
});
async function handleData (queryString,endpoint,bgk,bgk_tpf,bgk_file) {
    const query = queryString;
   const sources = [ ];
    
    //add endpoint
    if(endpoint!=""){
        var ep=endpoint.split(",");
             for(var k=0;k<ep.length;k++){
                //sources.push({ type:"hdtFile", value:ep[k] });
                sources.push({ type:"file", value:ep[k] });
             }
             
     }      
     
    //add bgk to source
     
    if(bgk!=""){
       var bgks=bgk.split(",");
       bgks.forEach(bgksFunction);
       function bgksFunction(item) {
        sources.push({ type:"sparql", value:item });
       }
    }
    
    if(bgk_file!=""){
        var bgk_files=bgk_file.split(",");
        bgk_files.forEach(bgk_filesFunction);
        function bgk_filesFunction(item) {
         sources.push({ type:"file", value:item });
        }
     }
    
    if(bgk_tpf!=""){
        var bgk_tpfs=bgk_tpf.split(",");    
            for(var j=0;j<bgk_tpfs.length;j++){
                sources.push({ type:"hypermedia", value:bgk_tpfs[j] });
            }
        
    }
    
    console.log(sources);
 /*original implementation*/
    const result = await engine.query(query, { sources });
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