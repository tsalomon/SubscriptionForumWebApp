function getDefSubs() {

    var header = "";

    $.ajax({
        url: "/defsubs",
        type: "GET",
        success: function(data) {

            data = JSON.parse(data);
            console.log(data);

            if (data.length == 0) {} else {
                header = Object.keys(data[0]);
                console.log(header);
                $("#numDefSubs").text(data.length);
            }

            var tableData = [
                ["title"]
            ];

            row = [];
            for (var i = 0; i < data.length; i++) {

                row.push(data[i].title);
                tableData.push(row);
                row = [];
            }

            makeTable($("#defaultSubs"), tableData);

        },
        error: function(data) {
            console.log("Could not retrieve default subsaiditts.");
        }
    });
}

function getSubSubs() {

    var header = "";
    var url = "";

    if (getParameterByName('user') != null) {
        url = "/subsubs?user=" + getParameterByName('user');
    } else {
        url = "/subsubs";
    }

    $.ajax({
        url: url,
        type: "GET",
        success: function(data) {

            data = JSON.parse(data);
            console.log(data);

            if (data.length == 0) {} else {
                header = Object.keys(data[0]);
                console.log(header);
                $("#numSubSubs").text(data.length);
            }

            var tableData = [
                ["title"]
            ];

            row = [];
            for (var i = 0; i < data.length; i++) {
                row.push(data[i].title);
                tableData.push(row);
                row = [];
            }

            makeTable($("#subSubs"), tableData);

        },
        error: function(data) {
            console.log("Could not retrieve subscribed subsaiditts.");
        }
    });
}

function addMyPosts() {

    var header = "";
    var url = "";
    var user = getParameterByName('user')

    if (user != null) {
        url = "/my?user=" + user;
    } else {
        user = "tim";
        url = "/my?user=" + user;
    }

    $("#user_header").html("&nbsp;" + user + "'s Front Page" + " <small>Top Posts in Subscribed Subsaiditts</small>")

    $.ajax({
        url: url,
        type: "GET",
        success: function(rows) {

            rows = JSON.parse(rows);
            console.log(rows);

            if (rows.length != 0) {
                header = Object.keys(rows[0]);
                console.log(header);
                $.each(rows, function(key, row) {
                    addPost(row);
                });

            }
        },
        error: errorAlert

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

function addDefPosts() {

    var header = "";

    //get request to server: /top
    $.ajax({
        url: "/top",
        type: "GET",
        success: function(rows) {

            //alert("success!!!!!");
            rows = JSON.parse(rows);
            console.log(rows);

            if (rows.length != 0) {
                header = Object.keys(rows[0]);
                console.log(header);
                $.each(rows, function(key, row) {
                    addPost(row);
                });

            }
        },
        error: function(rows) {
            console.log("Could not retrieve top posts.");
        }
    });
}

function scrollBottom() {

    $("html, body").animate({ scrollTop: $(document).height() }, "slow");

}

function query() {

    var header = "";
    var query = $("#query").val();
    
    var tableData = [];
    $("#query_results").empty();
	console.log("query_before: " + query)
	query = query.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
	console.log("query: " + query)

    $.ajax({
        url: "/query",
        type: "POST",
        data: { "query": query },
        success: function(rows) {

            rows = JSON.parse(rows);
            console.log(rows);

            if (rows !== null) {
				
				if(Array.isArray(rows) && rows.length !== 0){
					header = Object.keys(rows[0]);
					tableData.push(header);
					$.each(rows, function(key, row) {
							tableData.push(row);
					});

				}else{
					header = Object.keys(rows);
					tableData.push(header);
					var data = $.map(rows, function(val, key) { return val; });
					console.log(data)
					tableData.push(data);
				}
                makeTable($("#query_results"), tableData);
                scrollBottom();
            }
        },
        error: errorAlert
    });
}

var errorAlert = function(data) {

    var e = data.responseText;
    alert(data.status + " " + data.statusText + "\n\n" + e)

}

function makeTable(container, data) {
    var table = $("table").addClass('CSSTableGenerator');
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function(colIndex, c) {
            row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
        });
        table.append(row);
    });
    return container.append(table);
}

function login() {

    //find the login form by id
    var form = $('#login_frm');

    //get data from form 
    var user_input = form.find("input[name='user']");
    var pass_input = form.find("input[name='pass']");

    //package data like this
    var loginData = {
        user: user_input.val(),
        pass: pass_input.val()
    };

    //DEBUG code
    console.log(loginData);
    console.log(JSON.stringify(loginData));

    //send a POST request to the /login route
    $.ajax({
        url: "/login",
        type: "POST",
        data: loginData,
        success: function(data) {
            alert("Login Successful")
            window.location = data;
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert("Unsuccessful Login")
        }
    });

    //clear the form fields
    user_input.val("");
    pass_input.val("");

}

function addSub() {

    //get data from form
    var form = $('#sub_frm');
    var title = form.find("input[name='title']");
    var desc = form.find("input[name='desc']");
    var creator = form.find("input[name='creator']");

    var def = 0;
    if (form.find("input[name='def']").is(":checked")) {
        def = 1;
    }

    var data = {
        title: title.val(),
        desc: desc.val(),
        creator: creator.val(),
        def: def
    };

    $.ajax({
        url: "/addSub",
        type: "POST",
        data: data,
        success: function(data) {
            alert("Subsaiddit Added.")
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert("Subsaiddit not created.")
        }

    });

    //clear form fields
    title.val("");
    desc.val("");
    creator.val("");
}

function submitPost() {

    var form = $('#post_frm');

    var data = {}
    data.title = form.find("input[name='title']").val();
    data.url = form.find("input[name='url']").val();
    data.creator = form.find("input[name='creator']").val();
    data.text = form.find("textarea[name='text']").val();
    data.subs = form.find("input[name='subs']").val();
    data.upvotes = form.find("input[name='upvotes']").val();
    data.downvotes = form.find("input[name='downvotes']").val();

    //normalize string encoding
    for (attr in data) {
        data[attr] = data[attr].normalize()
        console.log(data[attr])
    }

    console.log(JSON.stringify(data));

    $.ajax({
        url: "/post",
        type: "POST",
        data: data,
        success: function(data) {
            alert("Post Added")
        },
        error: errorAlert
    });
}

function submitComment() {

    var form = $('#comment_frm');

    var data = {}
    data.creator = form.find("input[name='creator']").val();
    data.words = form.find("textarea[name='text']").val();
    data.upvotes = form.find("input[name='upvotes']").val();
    data.downvotes = form.find("input[name='downvotes']").val();
	data.p_reply = form.find("input[name='post_id']").val();
	data.c_reply = form.find("input[name='comment_id']").val();
	
    //normalize string encoding
    for (attr in data) {
        data[attr] = data[attr].normalize()
        console.log(data[attr])
    }

    console.log(JSON.stringify(data));

    $.ajax({
        url: "/comment",
        type: "POST",
        data: data,
        success: function(data) {
            alert("Comment Added")
        },
        error: errorAlert
    });
}

function deletePost() {

    var form = $('#delpost_frm');

    var data = {}
    data.id = parseInt(form.find("input[name='post_id']").val());
    console.log(JSON.stringify(data));

    $.ajax({
        url: "/post",
        type: "DELETE",
        data: data,
        success: function(rows) {
            alert("Post Deleted: \n\n" + JSON.stringify(rows))
        },
        error: errorAlert
    });
}

function subscribe() {

    //get users from form
    var form = $('#subscribe_frm');
    var data = {};
    data.user = form.find("input[name='user']").val();
    data.subs = form.find("input[name='subs']").val();

    //normalize string encoding
    for (attr in data) {
        data[attr] = data[attr].normalize()
        console.log(data[attr])
    }

    console.log(JSON.stringify(data));

    $.ajax({
        url: "/subscribe",
        type: "POST",
        data: data,
        success: function(rows) {
            alert("User '" + data.user + "' subscribed to '" + data.subs + "'\n\n" + JSON.stringify(rows))
        },
        error: errorAlert
    });
}

function favourite() {

    var form = $('#fav_frm');
    var data = {};
    data.user = form.find("input[name='user']").val();
    data.post_id = form.find("input[name='post_id']").val();
	
    console.log(JSON.stringify(data));

    $.ajax({
        url: "/fav",
        type: "POST",
        data: data,
        success: function(rows) {
            alert("User '" + data.user + "' favourited post: '" + data.post_id + "'\n\n" + JSON.stringify(rows))
        },
        error: errorAlert
    });
}

function cvote() {

    var form = $('#commentvote_frm');
    var data = {};
    data.user = form.find("input[name='user']").val();
    data.c_id = form.find("input[name='comment_id']").val();
	
	data.upvote = "";
	
    if (form.find("#comment_upvote").hasClass("active")) {
        data.upvote = 1;
    }else{
		data.upvote = 0;
	}
	
    console.log(JSON.stringify(data));
	
	$.ajax({
        url: "/cvote",
        type: "POST",
        data: data,
        success: function(rows) {
            alert("User '" + data.user + "' voted on comment: '" + data.c_id + "'\n\n" + JSON.stringify(rows))
        },
        error: errorAlert
    });
    
}

function pvote() {

    var form = $('#postvote_frm');
    var data = {};
    data.user = form.find("input[name='user']").val();
    data.p_id = form.find("input[name='post_id']").val();
	
	data.upvote = "";
	
    if (form.find("#post_upvote").hasClass("active")) {
        data.upvote = 1;
    }else{
		data.upvote = 0;
	}
	
    console.log(JSON.stringify(data));
	
	$.ajax({
        url: "/pvote",
        type: "POST",
        data: data,
        success: function(rows) {
            alert("User '" + data.user + "' voted on post: '" + data.p_id + "'\n\n" + JSON.stringify(rows))
        },
        error: errorAlert
    });
    
}

function addFriend() {

    //get users from form
    var form = $('#addFriend');
    var user1_input = form.find("input[name='user1']");
    var user2_input = form.find("input[name='user2']");
    var friendData = {
        user1: user1_input.val(),
        user2: user2_input.val()
    };

    console.log(JSON.stringify(friendData));

    //send friendData as POST to server
    $.ajax({
        url: "/friends",
        type: "POST",
        data: friendData,
        success: function(data) {
            alert("Friend Added")
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert("Error. Friend not added")
        }
    });

    //clear form fields
    user1_input.val("");
    user2_input.val("");
}

function signup() {

    var form = $('#signup_frm');
    var user_input = form.find("input[name='user']");
    var pass_input = form.find("input[name='pass']");
    var rep_input = form.find("input[name='rep']");

    var signupData = {
        user: user_input.val(),
        pass: pass_input.val(),
        rep: rep_input.val()
    };

    console.log(JSON.stringify(signupData));

    $.ajax({
        url: "/signup",
        type: "POST",
        data: signupData,
        success: function(data) {
            alert("Successful Signup")
        },
        error: function(xhr, status, error) {
            console.log(error);
            alert("Error! Signup unsuccessful.")
        }
    });

    user_input.val("");
    pass_input.val("");
    rep_input.val("");
}

function addPost(tuple) {

    var id = tuple.id;
    var ptime = tuple.pub_time;
    var etime = tuple.edit_time;
	etime = new Date(etime);
	var options = {
		year: "numeric", month: "numeric",
		day: "numeric", hour: "2-digit", minute: "2-digit"
	};
	etime = etime.toLocaleDateString("en-us", options)
	
	
    var title = tuple.title;
    var text = tuple.text;
    var url = tuple.url;
    var upvotes = tuple.upvotes;
    var downvotes = tuple.downvotes;
    var creator = tuple.creator;
    var subs = tuple.subsaiddit;
    var rating = tuple.rating;

    var post = '<div id="examplePost" class="panel panel-default"> \
					<div class="panel-heading" style="">\
						<h2 class="panel-title">\
						<span class="label label-pill label-primary pull-right" style="margin-right: 0px padding-bottom:3.6px; padding-top:3.6px">' 
						+ rating +
						'</span>\
						<h4 style="margin-top:0px; margin-bottom:0px">\
						<a style="text-decoration:none" href="http://' + url + '">' + title + '</a>\
						</h4>\
					</div>\
					<div class="panel-body" style="">\
						'
						+ text +
						'\
					</div>\
					<div class="panel-footer" style="padding-top:6px; padding-bottom:6px">\
 						Submitted at\
						<strong class="">'
						+ etime +
						'</strong> \
						by <strong class="">' 
						+ creator +
						'</strong>\
						to <strong class="">/' + subs + '</strong>.' + 
						'<span class="badge pull-right badge-info" style="margin:0px">id: ' +
						id +
						'</span>\
					</div>\
				</div>'

    var postObj = $.parseHTML(post);
    $("#posts").append(postObj);
}