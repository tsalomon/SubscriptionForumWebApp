
function getDefSubs(){

 var header = "";

	//get request to server: /s
	$.ajax({
			url: "/defsubs",
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
				
				//var tableData = [["title", "description", "creator", "create_time"]]
				var tableData = [["title", "description"]];
				
				row = [];
				for(var i=0; i < data.length; i++){
					
					row.push(data[i].title);
					row.push(data[i].description);
					//row.push(data[i].creator);
					//row.push(data[i].create_time);
					
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

function getSubSubs(){

 var header = "";
  var url = "";

	if(getParameterByName('user') != null){
		url = "/subsubs?user=" + getParameterByName('user');
		
	}else{
		url = "/subsubs";
	}

	//get request to server: /s
	$.ajax({
			url: url,
			type: "GET",
			success: function(data){
			
				//alert("success!!!!!");
				data = JSON.parse(data);
				console.log(data);
				
				if(data.length == 0){
				}else{
					header = Object.keys(data[0]);
					console.log(header);
					$("#numSubSubs").text(data.length);
				}
				
				//var tableData = [["title", "description", "creator", "create_time"]]
				var tableData = [["title", "description"]];
				
				row = [];
				for(var i=0; i < data.length; i++){
					
					row.push(data[i].title);
					row.push(data[i].description);
					//row.push(data[i].creator);
					//row.push(data[i].create_time);
					
					tableData.push(row);
					row = [];
				}
				
				makeTable($("#subSubs"), tableData);
			
			}, 
			error: function(data) {
					//alert('woops!'); //or whatever
					console.log("Could not retrieve subscribed subsaiditts.");
			}
	});
}


function addMyPosts(){

 var header = "";
 var url = "";
 var user = getParameterByName('user')

	if( user != null){
		url = "/my?user=" + user;
		
	}else{
		user = "tim";
		url = "/my?user=" + user; //
	}
	
	$("#user_header").html("&nbsp;" + user + "'s Front Page" + " <small>Top Posts in Subscribed Subsaiditts</small>")
	
	

	//get request to server: /top
	$.ajax({
			url: url,
			type: "GET",
			success: function(rows){
			
				//alert("success!!!!!");
				rows= JSON.parse(rows);
				console.log(rows);
				
				if(rows.length != 0){
					header = Object.keys(rows[0]);
					console.log(header);
					$.each(rows, function(key, row){
						addPost(row);
					});
				
				}
			}, 
			error: function(rows) {
					console.log("Could not retrieve your top posts");
			}
	});
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function addDefPosts(){

 var header = "";

	//get request to server: /top
	$.ajax({
			url: "/top",
			type: "GET",
			success: function(rows){
			
				//alert("success!!!!!");
				rows= JSON.parse(rows);
				console.log(rows);
				
				if(rows.length != 0){
					header = Object.keys(rows[0]);
					console.log(header);
					$.each(rows, function(key, row){
						addPost(row);
					});
				
				}
			}, 
			error: function(rows) {
					console.log("Could not retrieve top posts");
			}
	});
}

function scrollBottom(){

 $("html, body").animate({ scrollTop: $(document).height() }, "slow");


}

function query(){

 var header = "";
 var query = $("#query").val();
 console.log("query: " + query)
 var tableData = [];
 $("#query_results").empty();
 
 

	//get request to server: /query
	$.ajax({
			url: "/query",
			type: "POST",
			data: {"query":query},
			success: function(rows){
			
				//alert("success!!!!!");
				rows= JSON.parse(rows);
				console.log(rows);
				
				if(rows.length != 0){
					header = Object.keys(rows[0]);
					console.log(header);
					tableData.push(header);
					$.each(rows, function(key, row){
						tableData.push(row);
					});
					makeTable($("#query_results"), tableData);
					scrollBottom();
					
				}
			}, 
			error: function(data) {
				var e = data.responseText;
				alert(data.status + " "+data.statusText +"\n\n" + e)
			
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
			window.location = data;
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

function addSub(){
	
	//get data from form
	var form = $('#sub_frm');
	var title = form.find("input[name='title']");
	var desc = form.find("input[name='desc']");
	var creator = form.find("input[name='creator']");
	
	
	
	var def = 0;
	if(form.find("input[name='def']").is(":checked")){
		def = 1;
	}
	
	var data = {
		title:title.val(),
		desc:desc.val(),
		creator:creator.val(),
		def: def
	};
	
	console.log(data);
	

	//log that (best for debugging)
	console.log(data);
	console.log(JSON.stringify(data));

	//send data as POST to server
	$.ajax({
		url: "/addSub",
		type: "POST",
		data: data,
		success: function (data) {
			alert("Subsaiddit Added")
		},
		error: function (xhr, status, error) {
			console.log(error);
			alert("Error. Subsaiddit not created.")
		}

	});

	//clear form fields
	title.val("");
	desc.val("");
	creator.val("");
}


function submitPost(){
	
	//get data from form
	var form = $('#post_frm');
	
	var data = {}
	data.title = form.find("input[name='title']").val();
	data.url = form.find("input[name='url']").val();
	data.creator = form.find("input[name='creator']").val();
	data.text = form.find("textarea[name='text']").val();
	data.subs = form.find("input[name='subs']").val();
	data.upvotes = form.find("input[name='upvotes']").val();
	data.downvotes = form.find("input[name='downvotes']").val();

	console.log('submitPost()')
	
	//normalize string encoding
	for(attr in data){
		data[attr] = data[attr].normalize()
		console.log(data[attr])
	}
		
	//log that (best for debugging)
	//alert(JSON.stringify(data));
	console.log(JSON.stringify(data));

	//send data as POST to server
	$.ajax({
		url: "/post",
		type: "POST",
		data: data,
		success: function (data) {
			alert("Post Added")
		},
		error: function (data) {
			
			var e = data.responseText;
				alert(data.status + " "+data.statusText +"\n\n" + e)
		}


	});

	//clear form fields
	
}

function deletePost(){
	
	//get data from form
	var form = $('#delpost_frm');
	
	var data = {}
	data.id = parseInt(form.find("input[name='post_id']").val());

	console.log('deletePost()')
		
	//log that (best for debugging)
	//alert(JSON.stringify(data));
	console.log(JSON.stringify(data));

	//send data as POST to server
	$.ajax({
		url: "/post",
		type: "DELETE",
		data: data,
		success: function (rows) {
			alert("Post Deleted: \n\n" + JSON.stringify(rows))
		},
		error: function (qError) {
			
			var e = qError.responseText;
				alert(qError.status + " "+qError.statusText +"\n\n" + e)
		}


	});

	//clear form fields
	
}

function subscribe(){
	
	//get users from form
	var form = $('#subscribe_frm');
	var data = {};
	data.user = form.find("input[name='user']").val();
	data.subs = form.find("input[name='subs']").val();
	
	//normalize string encoding
	for(attr in data){
		data[attr] = data[attr].normalize()
		console.log(data[attr])
	}

	//log that (best for debugging)
	console.log(data);
	console.log(JSON.stringify(data));

	$.ajax({
		url: "/subscribe",
		type: "POST",
		data: data,
		success: function (rows) {
			alert("User '"+ data.user + "' subscribed to '" + data.subs +"'\n\n" + JSON.stringify(rows))
		},
		error: function(data) {
				var e = data.responseText;
				alert(data.status + " "+data.statusText +"\n\n" + e)
			
			}


	});

	//clear form fields

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


function addPost(tuple){
	
	try{
		
		var id = tuple.id;
		var ptime = tuple.pub_time;
		var etime = tuple.edit_time;
		var title = tuple.title;
		var text = tuple.text;
		var url = tuple.url;
		var upvotes = tuple.upvotes;
		var downvotes = tuple.downvotes;
		var creator = tuple.creator;
		var subs = tuple.subsaiddit;
		var rating = tuple.rating;
		
	}catch(e){
		alert("invalid post data");
	}
	
	var post = '<div id="examplePost" class="panel panel-default"> \
	\
					<div class="panel-heading">\
						<h2 class="panel-title">\
						<span class="badge pull-right" style="margin-right: 10px">'
						+ rating +
						'</span>\
						<span class="badge pull-right" style="margin-right: 10px">'
						+ subs +
						'</span>'
						+ title +
					'</div>\
	\
					<div class="panel-body">\
						<div class="well well-sm" style="margin-bottom:0px">'
						+ text +
						'</div>\
						<h5 class="pull-right"> \
						<span class="label label-default">id: '
						+ id +
						'</span>\
						<span class="label label-default">'
						+ etime +
						'</span>\
						<span class="label label-default">'
						+ creator +
						'</span>\
						</h5>\
						<h5 class="pull-left"> \
						<a for="basic-url" href="http://' + url +'"> http://'
						+ url +
						'</a>\
						</h5>\
					</div>\
				</div>'
					 
	console.log("creating post")
	
	var postObj = $.parseHTML(post);
	$("#posts").append(postObj);

}


			
			