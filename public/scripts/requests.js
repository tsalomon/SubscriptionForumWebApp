
function getDefSubs(){

 var header = "";

	//get request to server: /s
	$.ajax({
			url: "/s",
			type: "GET",
			success: function(data){
			
				//alert("success!!!!!");
				data = JSON.parse(data);
				console.log(data);
				
				if(data.length == 0){
				}else{
					header = Object.keys(data[0]);
					console.log(header);
					$("#numDefSubs").text(data.length);
				}
				
				var tableData = [header]
				
				row = [];
				for(var i=0; i < data.length; i++){
					row.push(data[i].title);
					row.push(data[i].description);
					row.push(data[i].creator);
					tableData.push(row);
					row = [];
				}
				
				makeTable($("#defaultSubs"), tableData);
			
			}, 
			error: function(data) {
					//alert('woops!'); //or whatever
					console.log("Could not retrieve default subsaiditts.");
			}
	});
}
			
function makeTable(container, data) {
	var table = $("table").addClass('CSSTableGenerator');
	$.each(data, function(rowIndex, r) {
		var row = $("<tr/>");
		$.each(r, function(colIndex, c) { 
			row.append($("<t"+(rowIndex == 0 ?  "h" : "d")+"/>").text(c));
		});
		table.append(row);
	});
	return container.append(table);
}

function login(){

	//find the login form by id
	var form = $('#login_frm');
	
	//get data from form 
	var user_input = form.find("input[name='user']");
	var pass_input = form.find("input[name='pass']");
	
	//package data like this
	var loginData = {
		user:user_input.val(),
		pass:pass_input.val()
	};
	
	//DEBUG code
	console.log(loginData);
	console.log(JSON.stringify(loginData));

	//send a POST request to the /login route
	$.ajax({
		url: "/login",
		type: "POST",
		data: loginData,
		success: function (data) {
			alert("Successful Login")
		},
		error: function (xhr, status, error) {
			console.log(error);
			alert("Unsuccessful Login")
		}
	});
	
	//clear the form fields
	user_input.val("");
	pass_input.val("");

}

function addFriend(){
	
	//get users from form
	var form = $('#addFriend');
	var user1_input = form.find("input[name='user1']");
	var user2_input = form.find("input[name='user2']");
	var friendData = {
		user1:user1_input.val(),
		user2:user2_input.val()
	};

	//log that (best for debugging)
	console.log(friendData);
	console.log(JSON.stringify(friendData));

	//send friendData as POST to server
	$.ajax({
		url: "/friends",
		type: "POST",
		data: friendData,
		success: function (data) {
			console.log('Success: ')
			alert("Friend Added")
		},
		error: function (xhr, status, error) {
			console.log(error);
			alert("Error. Friend not added")
		}

	});

	//clear form fields
	user1_input.val("");
	user2_input.val("");

}



function signup(){

	var form = $('#signup_frm');
	var user_input = form.find("input[name='user']");
	var pass_input = form.find("input[name='pass']");
	var rep_input  = form.find("input[name='rep']");
	
	var signupData = {
		user:user_input.val(),
		pass:pass_input.val(),
		rep: rep_input.val()
	};
	
	console.log(signupData);
	console.log(JSON.stringify(signupData));

	$.ajax({
		url: "/signup",
		type: "POST",
		data: signupData,
		success: function (data) {
			alert("Successful Signup")
		},
		error: function (xhr, status, error) {
			console.log(error);
			alert("Error! Signup unsuccessful.")
		}
	});
	
	user_input.val("");
	pass_input.val("");
	rep_input.val("");
	

}


function addPost(id, title, rating, text, url, time, creator){
	
	var post = '<div id="examplePost" class="panel panel-default"><div class="panel-heading"><h2 class="panel-title"><span class="badge pull-right" style="margin-right: 10px">'
					 + rating 
					 + '</span>'
					 + title 
					 + '</div><div class="panel-body"><div class="well well-sm" style="margin-bottom:0px">'
					 + text 
					 + '</div><h5 class="pull-left"> <span class="label label-default">id: '
					 + id 
					 + '</span> <span class="label label-default">'
					 + time
					 + '</span> <span class="label label-default">'
					 + creator
					 +'</span></h5><a class="pull-right" href="'
					 + url 
					 + '">'
					 + url
					 + '</a></div></div>'
					 
	console.log("creating post")
	
	var postObj = $.parseHTML(post);
	$("#posts").append(postObj);

}


			
			