var xmlHttp = null;


function httpPost(theUrl, data){
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", theUrl, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify(data));
	
	//when you send a req to a server and it resumes code
	//but this is like "ok yes that is finished I can process it now"
	
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status ==200){
			console.log(xhr.responseText);
		}
	}
	return xhr.responseText;

}

function httpGet(theUrl)
{
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true ); // false for synchronous request
	xmlHttp.send();
	
    xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4 && xmlHttp.status==200){
			console.log(xmlHttp.responseText);
		}
	}
	
	//alert(xmlHttp);
	//var data=xmlHttp.response;
	//alert(data);
	//var jsonResponse = JSON.parse(data);
	//alert(JSON.parse(xmlHttp.responseText));
	//console.log(xmlHttp.readyState);
    //return JSON.parse(xmlHttp.responseText);
	//window.alert(JSON.parse(xmlHttp.responseText));
	//window.alert('hey');

}

function getAjax(handleData){
	
	$.ajax({
		url: "/api/test",
		success: function(data){
			handleData(data)
		}
	});
	
}


function postAjax(formData, handleData){
	
	$.ajax({
		url: "/api/test",
		type: "POST",
		data: formData,
		success: function(data){
			handleData(data);
		}
	});
	
	
	
}







