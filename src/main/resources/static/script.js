var stompClient = null

function connect(){
	let socket = new SockJS("/chat")
	stompClient=Stomp.over(socket);
	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/return-to", function(response){
			showMessage(JSON.parse(response.body))
		})
	})
	
}

function showMessage(message) {
	var head;
	var d =  new Date(message.sendDate);
	var datestring =("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+" "+("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +d.getFullYear();
	
	var profileImage;
	if(message.profile != null) 
		profileImage = message.profile;
	else
		profileImage = "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";
console.log("image => "+profileImage);
	if(localStorage.getItem("name") == message.name) {
		head=`<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="data:image/jpeg;base64, ${message.data}"><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="data:video/mp4;base64,${message.data}" type="video/mp4"></video><br>`;
		}	

		head+=`${message.message}<span class="msg_time_send">${datestring}</span></div><div class="img_cont_msg"><img src=data:image/jpeg;base64, ${profileImage}",  class="rounded-circle user_img_msg"></div></div>`;
	}
	else {
		head=`<div class="d-flex justify-content-start mb-4" style="padding-left: 10px;"><div st class="img_cont_msg"><img src="data:image/jpeg;base64, ${message.profile}" class="rounded-circle user_img_msg"></div><div class="msg_cotainer"  style="min-width: 15vmin; text-align: center;margin-left: 20px;">`;
		if (message.type == 'IMAGE') {
			head+=`<img class="message-get-image" src="data:image/jpeg;base64, ${message.data}"><br>`;
		} else if(message.type == 'VIDEO') {
			head+=`<video class="message-get-video" controls><source src="data:video/mp4;base64,${message.data}" type="video/mp4"></video><br>`;
		}
		head+=`${message.message}<span class="msg_time">${datestring}</span></div></div>`;
	}
	
	$("#getMessage").append(head);
	$('#getMessage').animate({scrollTop: $('#getMessage').prop("scrollHeight")}, 500);
	 
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

function closeConnection() {
	stompClient.disconnect();
} 

$(document).ready((e) => {
	
	connect();

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
})