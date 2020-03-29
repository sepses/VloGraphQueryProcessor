
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
		//console.log(queryStringSelectOption)
		$('#queryarea').val($("#queryString option:selected").val());
	   
		// choose host
		chooseHost="";
		for(i=0;i<result.hostEndpoint.length;i++){
			input="<input type=\"checkbox\" name=\""+result.hostEndpoint[i].name+"\" value=\""+result.hostEndpoint[i].value+"\" "+result.hostEndpoint[i].checked+">"+result.hostEndpoint[i].label+"</input>";
			inputHidden="<input type=\"checkbox\" style=\"display:none\" name=\""+result.hostApi[i].name+"\" value=\""+result.hostApi[i].value+"\" "+result.hostApi[i].checked+">";
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

    //handle checkbox
    for(i=0;i<result.hostEndpoint.length;i++){
        $("#"+result.hostEndpoint.name).on('change', function(){
            $("#"+result.hostApi.name).prop('checked',this.checked);
        });
    }

    //handle time range
    $("#queryString").on('change', function(){
        //console.log(result.bgKnowledge.length);
        for(i=0;i<result.bgKnowledge.length;i++){
            $("#"+result.bgKnowledge[i].id).prop('checked',false);
        }
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

	$('#run_comunica').click(function(){
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
						   parseResource(uri[i],query,parsedQuery,startTime,endTime);
						//  alert(parse);
						//    if(parse=="success"){
						// 	   countParser++;
						//    }
					  }
					//   console.log(countParser);		
					// 	if(countParser>0){
					// 		comunicaExecuteQuery(query,getHost(),getBgKnowledge(),getBgKnowledgeTPF());
					// 	}
					}
					//alert(countParser);
				}});
	
		
	function parseResource(param0,param1,param2,param3,param4){
		
		$body.addClass("loading");
		 $.ajax({url: "http://localhost:3000/parseresource",
		
			 type: 'POST',
			 data: { url: param0,queryString: param1, parsedQuery:param2,startTime: param3, endTime:param4} ,
			 success: function(result){
				//var status=""; 
				var content = result.content;
				 if(content!=null){
						
					if (content.includes("success")){
						response = $.parseJSON(content);
						//status="success";
						//fire comunica
						// console.log(bgk);
						// console.log(bgk_tpf);
						comunicaExecuteQuery(param1,getHost(),getBgKnowledge(),getBgKnowledgeTPF());
						//console.log(getHost().join());	
					}else {
						$("#content").html("<font color='red'><h3>Parse Failed</h3></font>");
						$body.removeClass("loading");
						//status="failed";	
					}
				} else{
					$("#content").html("<font color='red'><h3>Parse Failed</h3></font>");
					$body.removeClass("loading");
					//status="failed";	
				}
				 
			//$body.removeClass("loading");	
			//status="success";
		}
		
		});
		return status;

		}
	
		function comunicaExecuteQuery(queryString,host,bgk,bgk_tpf){
			console.log(bgk.length);
			console.log(bgk_tpf.length);
			$.ajax({url: "http://localhost:3000/comunica",
    		type: 'POST',
			data: { queryString: queryString, endpoint:host.join(), bgk:bgk.join(),bgk_tpf:bgk_tpf.join()} ,
			success: function(result){
				response = $.parseJSON(result);
				//console.log(host.join());
				if(response.length==0){
					$("#content").html("<font color='red'><h3>Empty Result!</h3></font>");
				}else{
					var table = parseResultToTableComunica(response);
					$("#content").html(table);
					
		
				}
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
			
			   var tr="";
			             $.each(response, function(n, item) {
			            	 var num=n+1;
			              tr += "<tr><td>"+num+"</td>";
			               var k;
			                   for (k=0;k<col.length;k++){
			                	 //  console.log(col[k]);
			  		   tr+="<td>"+response[n][col[k]].value+"</td>";
			                  }
			              tr+="</tr>";
			             });
			         
			
			
			  table+=th+tr+"</table>";
			  return table;
	}

	});



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
             
              var table = parseResultToTable(response);
			  
			  $("#content").html(table);
			
 

        	 }
        	 } else{
        		 $("#content").html("<font color='red'><h3>Content is Null !!</h3></font>");
        	 }
        	 
	$body.removeClass("loading");
        	 
    }
	});
	};

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
