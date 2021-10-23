var stompClient = null

function connect(){
	let socket = new SockJS("/chat")
	stompClient=Stomp.over(socket);
	
	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/return-to", function(response){
			var data = JSON.parse(response.body);
			if(data.type == null) 
				null;
			else if(data.type == 'LIST') 
				showLive(data);
			else 
				showMessage(data);
			
		})
	})	
}

function sendMessage(data,type) {
	let jsonObj = { 
		id: localStorage.getItem("myuuid"),
		name:localStorage.getItem("name"),
		profile:localStorage.getItem("myimage"),
		type:type,
		data:data,
		text:$("#message").val(),
		sendDate:new Date()
	}	
	$("#message").val('')
	stompClient.send("/app/message", {}, JSON.stringify(jsonObj));
}

function joinAndClose(join) {
	
	let jsonObj = { 
		id: localStorage.getItem("myuuid"),
		name: localStorage.getItem("name"),
		profile: localStorage.getItem("myimage"),
		join:join,
		joinDate:new Date()
	}	
	
	stompClient.send("/app/setlive", {}, JSON.stringify(jsonObj));
 }

function closeConnection() {
	joinAndClose(false);
	stompClient.disconnect();
} 

$(document).ready((e) => {
	connect();
	
	setTimeout(() => {
		joinAndClose(true);
	}, 1000);
	

 	$("#selectImageInput").on('change',   function () {
        var reader = new FileReader();
        var selectedFile = this.files[0];
		var type = selectedFile.type.substring(0,5).toUpperCase();
		reader.onload = function () {
		  	sendMessage(this.result, type);
        }
        reader.readAsDataURL(selectedFile);
    })

	$("#sendMessage").click(()=>{
		sendMessage(null,'MESSAGE');
	})
	
	$("#CloseConnecrtion").click(()=>{
		closeConnection();
		location.href = "/";
	})
	
	
	$("#goInVideo").click(()=>{
		closeConnection();
		location.href = "video.html";
	})
	


	$("#clearText").click(()=>{
		$("#message").val('');
	})
	
	$('#selectedFile').change(function () {
    	var a = $('#selectedFile').val().toString().split('\\');
	});

	$('.selectImageSpan').click(function() {
		$('#selectImageInput').click();
	});

	 $("#message").on('keyup', function (event) {
      if (event.keyCode === 13) {
		if($("#message").val().length > 0)
         sendMessage(null,'MESSAGE');
      }
   });
})



function showLive(data) {

	if(data.show != null)
		joinGroupNameShow(data.show);

	list = data.list;
	$("#liveList").empty();			
	for (let data of list) {

		let d =  new Date() - new Date(data.joinDate);
		let weekdays     = Math.floor(d/1000/60/60/24/7);
		let days         = Math.floor(d/1000/60/60/24 - weekdays*7);
		let hours        = Math.floor(d/1000/60/60    - weekdays*7*24            - days*24);
		let minutes      = Math.floor(d/1000/60       - weekdays*7*24*60         - days*24*60         - hours*60);
		let seconds      = Math.floor(d/1000          - weekdays*7*24*60*60      - days*24*60*60      - hours*60*60      - minutes*60);
		var time ="";
		if(hours>0)
			time+=hours+"h ";
		time+=minutes+" m "+seconds+" s";
		$("#liveList").append(`<li class="active"><div class="d-flex bd-highlight"><div class="img_cont"><img src="${data.profile}" class="rounded-circle user_img"><span class="online_icon"></span></div><div class="user_info"><span>${data.name}</span><p>${time}</p></div></div></li>`);			
	}
}				

function joinGroupNameShow(message) {
	var d =  new Date(message.joinDate);
	var datestring =("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+" "+("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear();
	var text;
	if(message.join)
		text = "Join Chat At";
	else
		text = "Leave Chat At";
	$("#getMessage").append(`<div class="some_one_join_group"><b style="font-size: 20px;">${message.name}</b> - ${text} - ${datestring} </div>`);
	$('#getMessage').animate({scrollTop: $('#getMessage').prop("scrollHeight")}, 500);
}

function showMessage(message) {
	var head;
	var d =  new Date(message.sendDate);
	var datestring =d.toLocaleString('en-US', { hour: 'numeric',  minute: 'numeric', })+" "+("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear();
	
	if(localStorage.getItem("name") == message.name) {
		head=`<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="${message.data}" ><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="${message.data}" type="video/mp4"></video><br>`;
		}	
		head+=`${message.text}<span class="msg_time_send" style="left: 9px;">${datestring}</span></div><div class="img_cont_msg"><img src="${message.profile}",  class="rounded-circle user_img_msg"></div></div>`;
	}
	else {
		head=`<div class="d-flex justify-content-start mb-4" style="padding-left: 10px;"><div st class="img_cont_msg"><img src="${message.profile}" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"  style="min-width: 15vmin; text-align: center;margin-left: 20px;">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="${message.data}"><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="${message.data}" type="video/mp4"></video><br>`;
		}
		head+=`${message.text}<span class="msg_time"  style="right: 9px;">${datestring}</span></div></div>`;
	}
	
	$("#getMessage").append(head);
	$('#getMessage').animate({scrollTop: $('#getMessage').prop("scrollHeight")}, 500);
	 
}
