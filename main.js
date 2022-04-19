const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const playList = $(".playlist");
const header = $('.player h2');
const cd_thumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const song = $(".song");


var randomSong = [];


const app = {
  currentIndex: 0 /**bài hát bắt đầu */,
  isPlay: false,
  isRamdom: false,
  isRepeat: false,
  song: [
    {
      name: "Đám Cưới Nha",
      singer: "Hồng Thanh",
      path: "./acsset/music/ĐÁM CƯỚI NHA  HỒNG THANH X MIE  OFFICIAL AUDIO  LYRICS.mp3",
      image: "./acsset/img/DamCuoiNha.webp",
    },
    {
      name: "Khuê Mộc Lang",
      singer: "Hương Ly",
      path: "./acsset/music/Khuê Mộc Lang  Hương Ly  Jombie G5R  Official Lyric MV.mp3",
      image: "./acsset/img/KhueMocLang.webp",
    },
    {
      name: "Chạy Về Khóc Với Anh",
      singer: "Erik",
      path: "./acsset/music/CHẠY VỀ KHÓC VỚI ANH  Official Music Video Genshin Impact.mp3",
      image: "./acsset/img/CHayVeKhocVoiAnh.webp",
    },
    {
      name: "Để Mị Nói Cho Mà Nghe",
      singer: "Hoàng Thùy Linh",
      path: "./acsset/music/De-Mi-Noi-Cho-Ma-Nghe-Hoang-Thuy-Linh.mp3",
      image: "./acsset/img/Để Mị Nói Cho Mà Nghe.webp",
    },
    {
      name: "Unstoppable",
      singer: "Sia",
      path: "./acsset/music/Unstoppable-Sia.mp3",
      image: "./acsset/img/Unstoppable.webp",
    },
    {
      name: "Không Trọn Vẹn Nữa",
      singer: "Châu Khải Phong",
      path: "./acsset/music/Khong-Tron-Ven-Nua-Chau-Khai-Phong-ACV.mp3",
      image: "./acsset/img/Không Trọn Vẹn Nữa.webp",
    },
    {
      name: "Y Chang Xuân Sang",
      singer: "Nal",
      path: "./acsset/music/Y-Chang-Xuan-Sang-Nal.mp3",
      image: "./acsset/img/Y Chang Xuân Sang.webp",
    },
  ],

  render: function () {
    const currentSong = this.currentIndex;
    const htmls = this.song.map(function (song, index) {
      return `
        <div class="song ${index == currentSong ? 'active' : ''}" data-index = ${index}>
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `;
    });
    playList.innerHTML = htmls.join("");
  },

  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    const cdRotate = cd_thumb.animate({
      transform: ["rotate(0deg)", "rotate(360deg)"]
    },{
      duration: 10000,
      iterations: Infinity
    })
    cdRotate.pause();

    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    playBtn.onclick = function () {
      if(_this.isPlay){
        audio.pause();
      }
      else{
        audio.play();
      }
    }

    audio.onplay = function () {
      player.classList.add("playing");
      _this.isPlay = true;
      cd_thumb.style.borderRadius = "50%";
      cd_thumb.style.transition = "all 1s ease";
      setTimeout(function () {
        cdRotate.play();
      }, 1000);
    }

    audio.onpause = function () {
      player.classList.remove("playing");
      _this.isPlay = false;
      cd_thumb.style.borderRadius = "0";
      cd_thumb.style.transition = "all 1s ease";
      cdRotate.cancel();
    }

    audio.ontimeupdate = function () {
      if(audio.duration){
        const progressTime = Math.floor((audio.currentTime * 100) / audio.duration);
        progress.value = progressTime;
      }
    }

    progress.onchange = function (e) {
      if(audio.duration){
        const valueChange = Math.floor((e.target.value * audio.duration) / 100);
        audio.currentTime = valueChange;
      }
    }

    nextBtn.onclick = function () {
      _this.nextSong();
      _this.render();
      _this.scrollInToView();
      console.log(randomSong);
    }

    prevBtn.onclick = function () {
      _this.prevSong();
      _this.render();
      _this.scrollInToView();
    }

    randomBtn.onclick = function () {
      _this.isRamdom = !_this.isRamdom;
      randomBtn.classList.toggle("active");
    }

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active");
    }

    audio.onended = function () {
      if(_this.isRepeat){
        audio.play();
      }
      else{
        _this.nextSong();
        _this.render();
        _this.scrollInToView();
      }
    }

    playList.onclick = function (e) {
      const targetSong = e.target.closest('.song:not(.active)')
      if(targetSong || e.target.closest('.option')){
        if(targetSong){
          _this.currentIndex = targetSong.dataset.index;
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if(e.target.closest('.option')){
          console.log(e.target.closest('.option'));
        }
      }
    }
  },

  currentSong: function(){
    return this.song[this.currentIndex];
  },

  loadCurrentSong: function(){
    header.innerText = this.currentSong().name;
    cd_thumb.style.backgroundImage = `url('${this.currentSong().image}')`;
    audio.src = this.currentSong().path;
  },

  nextSong: function () {
    if(this.isRamdom){
      let newIndex;
      if(randomSong.length == 0){
        randomSong = [this.currentIndex];
      }
      do {
        newIndex = Math.floor(Math.random() * this.song.length);
      } while (randomSong.includes(newIndex));
      if (randomSong.length != this.song.length - 1) {
        
        randomSong.push(newIndex);
      }
      else
      {
        randomSong.splice(0, randomSong.length);
      }
      this.currentIndex = newIndex;
    }
    else{
      this.currentIndex++;
      randomSong = [this.currentIndex];
      if(this.currentIndex > this.song.length - 1){
        this.currentIndex = 0;
      }
    }
    this.loadCurrentSong();
    audio.play();
  },

  prevSong: function () {
    if(this.isRamdom){
      if(randomSong.length > 1){
        randomSong.pop();
        this.currentIndex = randomSong[randomSong.length - 1];
      }
      else{
        this.currentIndex = randomSong[randomSong.length - 1];;
      }
    }
    else{
      this.currentIndex--;
      randomSong = [this.currentIndex];
      if(this.currentIndex < 0){
        this.currentIndex = this.song.length - 1;
      }
    }
    
    this.loadCurrentSong();
    audio.play();
  },

  scrollInToView: function () {
    if(this.currentIndex == 0){
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
    else{
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  },

  start: function () {
    this.currentSong();

    this.loadCurrentSong();

    this.handleEvent();
    
    this.render();

  }
  
};
app.start();