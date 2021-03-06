
$(document).ready(function(){

	
	
	function readQueryFile(queryFile){
		var res = null;
		$.ajax({
        url: queryFile,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            res = data;
        } 
     });
		

		return res;
	}

    $.getJSON( "input.json", function(result) {
		var items = [];
		//queryString
		//console.log(result.queryString);
		//queryStringSelectOption="";
		for(i=0;i<result.queryString.length;i++){
			qs = readQueryFile(result.queryString[i].queryFile);
			//console.log(qs);
			option="<option name=\""+result.queryString[i].name+"\" value=\""+qs+"\" "+result.queryString[i].selected+">"+result.queryString[i].label+"</option>";
			queryStringSelectOption=queryStringSelectOption+option;
		}
		queryStringSelectOption=queryStringSelectOption;
		$("#queryString").html(queryStringSelectOption);
		console.log(queryStringSelectOption)
		$('#queryarea').val($("#queryString option:selected").val());
	
		// choose host
		chooseHost="";
		for(i=0;i<result.hostEndpoint.length;i++){
			input="<input type=\"checkbox\" name=\""+result.hostEndpoint[i].name+"\" value=\""+result.hostEndpoint[i].value+"\" id=\""+result.hostEndpoint[i].id+"\" onclick=\"checks('"+result.hostApi[i].id+"')\" "+result.hostEndpoint[i].checked+">"+result.hostEndpoint[i].label+"</input>";
			inputHidden="<input type=\"checkbox\" style=\"display:none\" name=\""+result.hostApi[i].name+"\" value=\""+result.hostApi[i].value+"\" id=\""+result.hostApi[i].id+"\" "+result.hostApi[i].checked+">";
			chooseHost=chooseHost+input+inputHidden;
			
		}

	
		$("#chooseHost").html(chooseHost);
		
		//choose Bg-Knowledge
		chooseBgKnowledge="";
		for(i=0;i<result.bgKnowledge.length;i++){
			inputBg="<input type=\"checkbox\" name=\""+result.bgKnowledge[i].name+"\" id=\""+result.bgKnowledge[i].id+"\" value=\""+result.bgKnowledge[i].value+"\" "+result.bgKnowledge[i].checked+">"+result.bgKnowledge[i].label+"</input>";
			chooseBgKnowledge=chooseBgKnowledge+inputBg;
		}
            $("#chooseBgKnowledge").html(chooseBgKnowledge);

   
    $("#queryString").on('change', function(){
		//handle bg-knowledge
        //console.log(result.bgKnowledge.length);
        for(i=0;i<result.bgKnowledge.length;i++){
            $("#"+result.bgKnowledge[i].id).prop('checked',false);
		}
		 //handle time range
        for(i=0;i<result.queryString.length;i++){
            if($(this).find('option:selected').attr("name")==result.queryString[i].name){
                $("#startTime").val(result.queryString[i].defaultTimeRange.startTime);
                $("#endTime").val(result.queryString[i].defaultTimeRange.endTime);
              
                if(result.queryString[i].bgKnowledge.length!=0){
                    for(n=0;n<result.queryString[i].bgKnowledge.length;n++){
                        $("#"+result.queryString[i].bgKnowledge[n]).prop('checked',true);
                    }     
                } 
            }
            // console.log(result.queryString[i].name);
            // console.log(result.queryString[i].bgKnowledge.length);
            
        }
        
    });
    
	});



/*	$("#queryString").on('change', function(){
		$("#dbpedia").prop('checked',false);
		$("#dbpedia_tpf").prop('checked',false);
		$("#csgk_tpf").prop('checked',false);
		$("#csgk").prop('checked',false);
		//alert("test");
		if($(this).find('option:selected').attr("name")=="q2"){
			$("#startTime").val("Nov 11 10:00:04");
			$("#endTime").val("Nov 11 10:10:04");
		}else if($(this).find('option:selected').attr("name")=="q3"){
			$("#startTime").val("Oct 29 16:38:00");
			$("#endTime").val("Oct 29 16:41:00");
			$("#csgk_tpf").prop('checked',true);
			
		}else{
			$("#startTime").val("Dec 30 23:50:04");
			$("#endTime").val("Dec 31 01:03:46");
			$("#dbpedia_tpf").prop('checked',true);
		}
	});*/

	


function getHost(){
    event.preventDefault();
    var host = $("input:checkbox[name=hostEndpoint]:checked").map(function(){
      return $(this).val();
    }).get(); // <----
	//console.log(host);
	return host;
}


function getHostApi(){
    event.preventDefault();
    var host = $("input:checkbox[name=hostApi]:checked").map(function(){
      return $(this).val();
    }).get(); // <----
	//console.log(host);
	return host;
}

function getBgKnowledge(){
    event.preventDefault();
    var bgk = $("input:checkbox[name=bgk]:checked").map(function(){
      return $(this).val();
    }).get(); // <----
	//console.log(bgk);
	return bgk;
}

function getBgKnowledgeFile(){
    event.preventDefault();
    var bgk_file = $("input:checkbox[name=bgk_file]:checked").map(function(){
      return $(this).val();
    }).get(); // <----
	//console.log(bgk);
	return bgk_file;
}


function getBgKnowledgeTPF(){
    event.preventDefault();
    var bgk_tpf = $("input:checkbox[name=bgk_tpf]:checked").map(function(){
      return $(this).val();
    }).get(); // <----
	//console.log(bgk_tpf);
	return bgk_tpf;
}



	$('#queryString').on('change', function(){
	$('#queryarea').val(this.value);
	//alert(this.value);
});

$('#reset').click(function() {
    location.reload();
  });
	$body = $("body");



	
	
	function checkCreateCounter(uris){
		var status="";
		$.post({url: "http://localhost:3000/getapicounter",
		type: 'POST',
		async: false,
		data: { urisize: uris} ,
		success: function(result){
			console.log("api: "+result);
			console.log("uri: "+uris);
			if(result=="complete"){
				status="complete";
			}else{
				status="notcomplete";
			}
		}
	 });
	 return status;
	}

	$('#query_comunica').click(function(){
		var t0 = performance.now();
		var query = $('#queryarea').val();
		comunicaExecuteQuery(query,getHost(),getBgKnowledge(),getBgKnowledgeTPF(),getBgKnowledgeFile(),t0);
		
	});

	function comunicaExecuteQuery(queryString,host,bgk,bgk_tpf,bgk_file,t0){
		$body.addClass("loading");
		console.log(bgk.length);
		console.log(bgk_tpf.length);
		console.log(bgk_file.length);
		$.ajax({url: "http://localhost:3000/comunica",
		type: 'POST',
		data: { queryString: queryString, endpoint:host.join(), bgk:bgk.join(),bgk_tpf:bgk_tpf.join(),bgk_file:bgk_file.join()} ,
		success: function(result){
			response = $.parseJSON(result);
			//console.log(host.join());
			if(response.length==0){
				$("#content").html("<font color='red'><h3>Empty Result!</h3></font>");
			}else{
				var table = parseResultToTableComunica(response);
				
				$("#content").html(table);
				
	
			}		
		var t1 = performance.now();
		$("#runningTime").html("Process Time : " + (t1 - t0) + " milliseconds.");
		$body.removeClass("loading");
			
		}
	});
		
   
	}

	function parseResultToTableComunica(response){
		var table="<table border='1'>";
			   var th = "<tr><th>Num.</th>";
			   var col = [];
			   var p = response[0];
			   for (var key in p) {
					if (p.hasOwnProperty(key)) {
						th+="<th>"+key+"</th>";
						col.push(key);
						
					}
				}
			   th+="</tr>";
			
			   var tr="<tr><td>number of line : "+response.length+"</td></tr>";
			 /*var tr="";
			             $.each(response, function(n, item) {
							 var num=n+1;
							//  if(num>=1){
							// 	 return;
							//  }
			              tr += "<tr><td>"+num+"</td>";
			               var k;
			                   for (k=0;k<col.length;k++){
			                	 //  console.log(col[k]);
			  		   tr+="<td>"+response[n][col[k]].value+"</td>";
			                  }
			              tr+="</tr>";
			             });
			         
			*/
			
			  table+=th+tr+"</table>";
			  return table;
	}

	$('#run_comunica').click(function(){
		$body.addClass("loading");
	  var t0 = performance.now();
	  var uri = getHostApi();
   	  var query = $('#queryarea').val();
	  var startTime = $('#startTime').val();
	  var endTime = $('#endTime').val();
	  var parsedQuery;
	  console.log(uri);
	   $.post({url: "http://localhost:3000/parsequery",
		         type: 'POST',
		         data: { queryString: query} ,
		         success: function(result){
					parsedQuery = JSON.stringify(result);
					   var countParser=0;
					   //console.log(result);
					if(uri.length!=0){
				  	for(var i=0;i<uri.length;i++){
						 parseResource(uri[i],uri.length,query,parsedQuery,startTime,endTime,t0);
					  }
					}
				
				}}).fail(function(result) { 
					res = JSON.stringify(result);
					alert("Query error"+ res); 
				 });
		// var t1 = performance.now();
		// $("#runningTime").html("Process Time : " + (t1 - t0) + " milliseconds.");
		// $body.removeClass("loading");


	});

	function parseResource(param0,urisize,param1,param2,param3,param4,t0){
		var status="";
		 $.ajax({url: "http://localhost:3000/parseresource",
		 	
			 type: 'POST',
			 //async: false,
			 data: { url: param0,queryString: param1, parsedQuery:param2,startTime: param3, endTime:param4} ,
			 success: function(result){
				 
				var content = result.content;
				var cont=$.parseJSON(content);
				//trigger and chek counter parser

				var check = checkCreateCounter(urisize);
				console.log(check);
				if(check=="complete"){
					//fire comunica
					console.log("fire comunica");
					$body.removeClass("loading");
				
					comunicaExecuteQuery(param1,getHost(),getBgKnowledge(),getBgKnowledgeTPF(),getBgKnowledgeFile(),t0);
					
				}

				status= cont.content;	
		},
		error: function() {
		  status="failed";
        }
		
		});
			return status;

		}

   $('#run').click(function(){
	   
	  var query = $('#queryarea').val();
	  var startTime = $('#startTime').val();
	  var endTime = $('#endTime').val();
	  var parsedQuery;
	   $.post({url: "http://localhost:3000/parsequery",
		         type: 'POST',
		         data: { queryString: query} ,
		         success: function(result){
		        	 parsedQuery = JSON.stringify(result);
		        	getApi(query,parsedQuery,startTime,endTime);
		        	 //console.log(requestURL);
		        }});
		       
	
	function getApi(param1,param2,param3,param4){
		
    $body.addClass("loading");
	 $.ajax({url: "http://localhost:3000/getapi",
    
    	 type: 'POST',
         data: { queryString: param1, parsedQuery:param2,startTime: param3, endTime:param4} ,
         success: function(result){
        	 var content = result.content;
        	 if(content!=null){
        	 if (content.includes("<ModelCom")){
        		 alert(content);
        		 $("#content").html("");
        		 //var wnd = window.open("about:blank", "", "_blank");
        		 //wnd.document.write(result.content);
        	 }else if(content.includes("Empty Result")){
        		 $("#content").html("<font color='red'><h3>Empty Result !!</h3></font>");
        	 }else{
        	 
             response = $.parseJSON(content);
			 
			  var countNumber = parseResultToTable(response);
             // var table = parseResultToTable(response);
			  
			  $("#content").html(countNumber);
			
 

        	 }
        	 } else{
        		 $("#content").html("<font color='red'><h3>Content is Null !!</h3></font>");
        	 }
        	 
	$body.removeClass("loading");
        	 
    }
	});
	};

	function parseResulttoCountNumber(response){
		var count=0;
		$.each(response.results.bindings, function(n, item) {
			count++;
		});

		return "total data="+count;

	}

	function parseResultToTable(response){
		var table="<table border='1'>";
			   var th = "<tr><th>Num.</th>";
			   var col = [];
			     $.each(response.head.vars, function(i, item) {
			        th+="<th>"+response.head.vars[i]+"</th>";
			         col.push(response.head.vars[i]);
			     });
			   th+="</tr>";
			
			   var tr="";
			             $.each(response.results.bindings, function(n, item) {
							 var num=n+1;
							// if (num>=1){
								//break;
								//alert("test");
							// }
			              tr += "<tr><td>"+num+"</td>";
			               var k;
			                   for (k=0;k<col.length;k++){
			  		   tr+="<td>"+response.results.bindings[n][col[k]].value+"</td>";
			                  }
			              tr+="</tr>";
			             });
			  table+=th+tr+"</table>";
			  return table;
	}
	
  });
 
   });

  function checks(par){
	//alert(par);
	if(document.getElementById(par).checked==null || document.getElementById(par).checked==false){
	  document.getElementById(par).checked = true;
	}else{
	  document.getElementById(par).checked = false;
	}
}