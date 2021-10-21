var stompClient = null

function connect(){
	let socket = new SockJS("/chat")
	stompClient=Stomp.over(socket);
	
	stompClient.connect({}, function(frame){
		stompClient.subscribe("/topic/getLiveStremData", function(response){
			showVideo(response.body);
		})
	})
	
}


$(document).ready(function(){


    $("#start").click(()=>{
      connect();
		  test();
	});

     $("#view").click(()=>{
        connect();
	});
    
});

function showVideo(base64) {
     document.querySelector("#image1").src = base64;
}


// Allow accessing the camera

function  test() {  
 var video = document.querySelector("#videoElement");
 if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });     
 }
}

 
var resultb64="";
 var base64 = "";
 function capture() {       
    var canvas = document.getElementById('image');     
    var video = document.getElementById('videoElement');
    canvas.width = 200;
    canvas.height = 200;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);  
    document.getElementById("image").innerHTML = canvas.toDataURL(); 
    base64 =  canvas.toDataURL(); 
 }
  document.getElementById("image").innerHTML = resultb64;


var video = document.getElementById('videoElement'),
lastTime = -1;
function draw() {
    var time = video.currentTime;
    if (time !== lastTime) {
        capture();
        console.log(base64);
        if(stompClient != null)
            stompClient.send("/app/liveStrem", {}, base64);
        lastTime = time;
    }
    requestAnimationFrame(draw);
}

draw();






// function test(){

//  var video = document.querySelector("#videoElement");

// //mediaDevice and userMedia to navigate the access for camera

// if (navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({
//         video: true
//         // after allowing the camera start the video stream
//     }).then(function (stream) {
//         video.srcObject = stream

//         //play the video
//         console.log("video src =>"+video.srcObject);

//         //stompClient.send("/app/liveStrem", {}, stream);
//         video.play();

         
//     }).catch(function (error) {
//         console.log(error);
//     });
    
// }

// // capture Images
//     cap();
// }

// function cap(){
// var image = document.getElementById('image'),
// context = image.getContext('2d');  //setting for resolution of image

// document.getElementById('capture').addEventListener('click', function () {
//     // draw a image when the button clicked on the canvas
//     console.log("click");
//     context.drawImage(video, 0, 0, image.width, image.height);

    
// });

// }
