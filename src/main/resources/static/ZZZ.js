var stream;

var stompClient = null
var video = document.querySelector("#video2");

function connect(){
	let socket = new SockJS("/chat")
	stompClient=Stomp.over(socket);
	
	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/getTest", function(response){			
            
            setTimeout(() => {
                video.src = response.body;
            }, 10000);
    
		})
	})
	
}
  
$(document).ready(function(){

connect();
});

function hasUserMedia() { 
   //check if the browser supports the WebRTC 
   return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
      navigator.mozGetUserMedia); 
} 
 
if (hasUserMedia()) {
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia; 
		
   //enabling video and audio channels 
   navigator.getUserMedia({ video: true, audio: true }, function (s) { 
      stream = s; 
      var video = document.querySelector("#video");
      
      	
        
      video.srcObject =  stream;
      //inserting our stream to the video tag     
    //   video.src = window.URL.createObjectURL(stream); 
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = event => {
        const blob = event.data;
        
        var reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            var base64data = reader.result;                
            stompClient.send("/app/test", {}, base64data);
        }
        
    };

    recorder.start(1000);

   }, function (err) {}); 
	
} else { 
   alert("WebRTC is not supported"); 
}
  
btnGetAudioTracks.addEventListener("click", function(){ 
   console.log("getAudioTracks"); 
   console.log(stream.getAudioTracks()); 
});
  
btnGetTrackById.addEventListener("click", function(){ 
   console.log("getTrackById"); 
   console.log(stream.getTrackById(stream.getAudioTracks()[0].id)); 
});
  
btnGetTracks.addEventListener("click", function(){ 
   console.log("getTracks()"); 
   console.log(stream.getTracks()); 
});
 
btnGetVideoTracks.addEventListener("click", function(){ 
   console.log("getVideoTracks()"); 
   console.log(stream.getVideoTracks());
});

btnRemoveAudioTrack.addEventListener("click", function(){ 
   console.log("removeAudioTrack()"); 
   stream.removeTrack(stream.getAudioTracks()[0]); 
});
  
btnRemoveVideoTrack.addEventListener("click", function(){ 
   console.log("removeVideoTrack()"); 
   stream.removeTrack(stream.getVideoTracks()[0]); 
});