const socket = io('/');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid')
myVideo.muted = true;
var peer = new Peer();

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true //Gain access to user's video and audio. This will return an object with video and audio attributes set as true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    
    peer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        setTimeout(()=>{
            connecToNewUser(userId,stream)
        },1000)
    })
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video) //Append video element to videoGrid
}



// const scrollToBottom = () => {
//   var d = $('.main__chat_window');
//   d.scrollTop(d.prop("scrollHeight"));
// }


    let text = document.querySelector('#chat_message');
    console.log(document.querySelector('html'));
    document.querySelector('html').addEventListener('keydown', function (e) {
      if (e.which == 13 && text.value.length !== 0) {
        socket.emit('message', text.value);
        text.value = '';
      }
    });

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
