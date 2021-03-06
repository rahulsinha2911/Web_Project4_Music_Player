var albumName = ["Imagine Dragon - Evolve","Maroon 5 - V", "Fate of the Furious", "Zero"];
var albumArt = ["Believer.jpeg", "Sugar.png", "GoodLife.jpg", "Zero.jpg"];
var title =["Believer", "Sugar", "Good Life", "Mere naam tu"];
var durationList=["3:37","5:01","3:51","2:00"];
var sequence=[];
var favList=[];

var favBtn = $('.unfav i');
var pauseAndPlay = $(".play i");
var nextBtn = $(".next i");
var prevBtn = $(".back i");
var repeatBtn = $(".repeat i");
var shuffleBtn = $(".shuffle i");
var scrollBar = $("#scroll input");
var noOfSongs = title.length;

//initializing sequence
for(var i=0;i<noOfSongs;i++)
{ sequence.push(i);
}

//intializing favList
for(var i=0;i<noOfSongs;i++)
{ favList.push(0);
}

//Calculating duration of all songs
/*
window.onload=loadDuration;
function loadDuration(){
  for(var i=0 ;i<noOfSongs; i++)
  { let song=new Audio();
    song.src="songs/"+title[i]+'.mp3';
    let tempA=setInterval(function()
    { if(song.readyState>0)
      { var tempB=timeString(song.duration);
        durationList.push(tempB);
        console.log(durationList);
        clearInterval(tempA);
      }
    },10);
  }
  playSong();
}
*/
var song = new Audio();
var currentSong=0;
var cTime=0;
var repeat=false;

//play song function with totaltime update
window.onload=playSong;
function playSong()
{ console.log("Window is updated");
  song.src="songs/"+title[sequence[currentSong]]+'.mp3';
  $(".albumArt img").attr("src","images/"+albumArt[sequence[currentSong]]);
  $(".ablumName").text(albumName[sequence[currentSong]]);
  $(".title").text(title[sequence[currentSong]]);
  // fav
  if(favList[sequence[currentSong]])
  { favBtn.attr('class',"fas fa-heart");
  }
  else
  { favBtn.attr('class',"far fa-heart");
  }
  let temp=setInterval(function(){
    if(song.readyState>0)
    { $(".totalTime").text(durationList[sequence[currentSong]]);
      song.play();
      updateQueue();
      clearInterval(temp);
    }
  },10);
}

//currentTime update function
var ct=setInterval(function(){

  let temp=timeString(song.currentTime);
  $(".currentTime").text(temp);
  let per =Math.round(1000*(song.currentTime/song.duration));
  scrollBar.prop("value",per);
  if(per>=1000){checkRepeat();}
},10);

//on input change
scrollBar.on('oninput',function(){
  console.log("yup");
  song.currentTime=((scrollBar.prop("value")*song.duration)/100);
});

//Pause and Play button function
pauseAndPlay.on('click',function(){
  if(pauseAndPlay.attr('class')==="fas fa-pause-circle")
  { pauseAndPlay.attr('class', "fas fa-play-circle");
    song.pause();
  }
  else{
    pauseAndPlay.attr('class', "fas fa-pause-circle");
    song.play();
  }
});

// Next and prev button
nextBtn.on('click',function (){
  currentSong=currentSong+1;
  currentSong=currentSong%noOfSongs;
  playSong();
});
prevBtn.on('click',function(){
  currentSong=currentSong-1+noOfSongs;
  currentSong=currentSong%noOfSongs;
  playSong();
});

//repeat button
repeatBtn.on('click',function(){
  if(repeat){repeat=false;
    $(".repeat span").attr("style", "display: none !important");
  }
  else{
    repeat=true;
    $(".repeat span").attr("style", "display: inline !important");
  }
});

// converting number to time string
function timeString(p)
{ let t=Math.round(p);
  let m=Math.floor(t/60);
  let s=t%60;
  if(s<10){  s="0"+s;}
  return (m+":"+s);
}

// repeat or not
function checkRepeat()
{ if(repeat){  
    playSong();
  }
  else
  { currentSong=currentSong+1;
    currentSong=currentSong%noOfSongs;
    playSong();
  }
}
//queue update
function updateQueue()
{ $(".queue #song_1 .songName").text(title[sequence[(currentSong+1)%noOfSongs]]);
  $(".queue #song_2 .songName").text(title[sequence[(currentSong+2)%noOfSongs]]);
  $(".queue #song_3 .songName").text(title[sequence[(currentSong+3)%noOfSongs]]);
  $(".queue #song_1 .duration").text(durationList[sequence[(currentSong+1)%noOfSongs]]);
  $(".queue #song_2 .duration").text(durationList[sequence[(currentSong+2)%noOfSongs]]);
  $(".queue #song_3 .duration").text(durationList[sequence[(currentSong+3)%noOfSongs]]);
}

//shuffle button
shuffleBtn.on('click',function(){
  var temp = Math.floor((Math.random() * 10) )%2;
  if(temp)
  { swap(sequence,(currentSong+1)%noOfSongs,(currentSong+3)%noOfSongs);
  }
  else
  { swap(sequence,(currentSong+2)%noOfSongs,(currentSong+3)%noOfSongs);
  }
  updateQueue();
});
//swap function
function swap(arr, a, b)
{ let temp=arr[a];
  arr[a]=arr[b];
  arr[b]=temp;
}

//Volume
var volBtn = $('.volume i');
var volSlider = $('#volSlider input');
var prevValue=1.0;
volBtn.on('click',function(){
  if(song.volume==0)
  { volSlider.prop('value',prevValue);
    changeVol();
    volBtn.removeClass('fa-volume-mute');
    volBtn.addClass('fa-volume-up');
  }
  else
  { volSlider.prop('value',0);
    changeVol();
    volBtn.removeClass('fa-volume-up');
    volBtn.addClass('fa-volume-mute');
    console.log(song.volume);
  }
});
function changeVol()
{ prevValue=song.volume*10;
  song.volume= volSlider.prop('value')/10;
  if(song.volume==0)
  { volBtn.removeClass('fa-volume-up');
    volBtn.addClass('fa-volume-mute');
  }
  else{
    volBtn.removeClass('fa-volume-mute');
    volBtn.addClass('fa-volume-up');
  }
}

//favourite Button

favBtn.on('click',function(){
  // making fav
  if(favBtn.attr('class')=="far fa-heart")
  { favBtn.removeClass('far fa-heart');
    favBtn.addClass('fas fa-heart');
    favList[sequence[currentSong]]=1;
  }
  // making unfav
  else{
    favBtn.removeClass('fas fa-heart');
    favBtn.addClass('far fa-heart');
    favList[sequence[currentSong]]=0;
  }
});

var sideBarFav = $("#sideBarFav");
var favouriteSong=$(".side-menu .side-popular-music");
//sideBar
$(".header .navi span").click(function(){
  $(".side-menu").animate({marginLeft: '0px'});
  $(".volume-slider").animate({marginTop: '0px'}, 500);
  //updateSideBar();
  sideBarFav.hide();
}); 
$(".side-menu li a, .side-menu .close").click(function(){
  $(".side-menu").animate({marginLeft: '-310px'});
}); 

// update favourite song sidebar
favouriteSong.on('click',function(){
    $('#sideBarFav').toggle();
    updateSideBar();
});
function updateSideBar()
{ 
  $('#sideBarFav .insideEle').remove();
  for(var i=0;i<noOfSongs;i++)
  { if(favList[i])
    { var favSong = "<div class='insideEle' id='"+sequence[i]+"'>"+title[i]+"</div>";
      sideBarFav.append(favSong);
    }
  }
}

// on click to favourite song
$(document.body).on('click', '#sideBarFav div' ,function()
  { console.log("Button is clicked");
    currentSong = $(this).attr('id');
    playSong();
    $(".side-menu").animate({marginLeft: '-310px'},1000);
  }
);