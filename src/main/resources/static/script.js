var stompClient = null

function connect(){
	let socket = new SockJS("/chat")
	stompClient=Stomp.over(socket);
	
	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/return-to", function(response){
			showMessage(JSON.parse(response.body))
		})
	})

	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/getAllLive", function(response){
			showLive(JSON.parse(response.body))
		})
	})
	
}

function sendMessage(data,type) {
	let jsonObj = { 
		name:localStorage.getItem("name"),
		profile:localStorage.getItem("myimage"),
		type:type,
		data:data,
		message:$("#message").val(),
		sendDate:new Date()
	}	
	$("#message").val('')
	stompClient.send("/app/message", {}, JSON.stringify(jsonObj));
}

function joinIng() {
	let jsonObj = { 
		name:localStorage.getItem("name"),
		profile:localStorage.getItem("myimage"),
		joinDate:new Date()
	}	
	stompClient.send("/app/setlive", {}, JSON.stringify(jsonObj));
 }

function closeConnection() {
	stompClient.disconnect();
} 


$(document).ready((e) => {
	
	connect();
	setTimeout(() => {
		joinIng();
	}, 5000);
	

 	$("#selectImageInput").on('change',   function () {
        var reader = new FileReader();
        var selectedFile = this.files[0];
		var type = selectedFile.type.substring(0,5).toUpperCase();
		console.log("type => "+type);
        reader.onload = function () {
          	var comma = this.result.indexOf(',');
          	var base64 = this.result.substr(comma + 1);
		  	sendMessage(base64, type);
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


function showLive(message) {

}

function showMessage(message) {
	var head;
	var d =  new Date(message.sendDate);
	var datestring =("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+" "+("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear();
	
	var profileImage;

	if(message.profile == null) 
		profileImage = "https://thumbs.dreamstime.com/b/businessman-icon-vector-male-avatar-profile-image-profile-businessman-icon-vector-male-avatar-profile-image-182095609.jpg";
	else
		profileImage = `data:video/mp4;base64, ${message.profile}`;

	if(localStorage.getItem("name") == message.name) {
		head=`<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="data:image/jpeg;base64, ${message.data}" ><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="data:video/mp4;base64,${message.data}" type="video/mp4"></video><br>`;
		}	
		head+=`${message.message}<span class="msg_time_send" style="left: 9px;">${datestring}</span></div><div class="img_cont_msg"><img src="${profileImage}",  class="rounded-circle user_img_msg"></div></div>`;
	}
	else {
		head=`<div class="d-flex justify-content-start mb-4" style="padding-left: 10px;"><div st class="img_cont_msg"><img src="${profileImage}" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"  style="min-width: 15vmin; text-align: center;margin-left: 20px;">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="data:image/jpeg;base64, ${message.data}"><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="data:video/mp4;base64,${message.data}" type="video/mp4"></video><br>`;
		}
		head+=`${message.message}<span class="msg_time"  style="right: 9px;">${datestring}</span></div></div>`;
	}
	
	$("#getMessage").append(head);
	$('#getMessage').animate({scrollTop: $('#getMessage').prop("scrollHeight")}, 500);
	 
}