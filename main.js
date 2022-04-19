const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const PLAYER_STORAGE_KEY = "player";


const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cd_thumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevtBtn = $(".btn-prev");
const repeatBtn = $(".btn-repeat");
const randomBtn = $(".btn-random");
const playList = $(".playlist");


const randomSong = [];

const app = {
  currentIndex: 0 /**bài hát bắt đầu */,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
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
      singer: "Na
l",

      path: "./acsset/music/Y-Chang-Xuan-Sang-Nal.mp3",
      image: "./acsset/img/Y Chang Xuân Sang.webp",
    },
  ],
  settingConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    var currentIndex = this.currentIndex;
    const htmls = this.song.map(function (song, index) {
      return `
        <div class="song ${index === currentIndex ? "active" : ""}" data-index = ${index}>
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

    //CD rotate
    const cdRotate = cd_thumb.animate(
      {
        transform: "rotate(360deg)",
      },
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdRotate.pause();

    //xử lý phóng to/ thu nhỏ CS
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCd = cdWidth - scrollTop;
      cd.style.width = newCd > 0 ? newCd + "px" : 0;
      cd.style.opacity = newCd / cdWidth;
    };

    //Xử lý khi play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //khi được play
    audio.onplay = function () {
      $(".player").classList.add("playing");
      _this.isPlaying = true;
      cd_thumb.style.borderRadius = "50%";
      cd_thumb.style.transition = "all 1s ease";
      cdRotate.play();
    };

    //khi được pause
    audio.onpause = function () {
      $(".player").classList.remove("playing");
      _this.isPlaying = false;
      cd_thumb.style.borderRadius = "0";
      cd_thumb.style.transition = "all 1s ease";
      cdRotate.cancel();
    };

    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        var progressTime = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressTime;
      }
    };

    //xử lý thay đổi position của progress
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.nextRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //prev song
    prevtBtn.onclick = function () {
      if (_this.isRandom) {
        _this.prevRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    //ramdom song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.settingConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active");
    };

    //repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.settingConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active");
    };

    //end song
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        _this.nextSong();
        audio.play();
      }
    };

    //mouse down
    nextBtn.onmousedown = function () {
      nextBtn.classList.add("active");
    };
    nextBtn.onmouseup = function () {
      nextBtn.classList.remove("active");
    };
    prevtBtn.onmousedown = function () {
      prevtBtn.classList.add("active");
    };
    prevtBtn.onmouseup = function () {
      prevtBtn.classList.remove("active");
    };

    //click playList
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');
      if(songNode || e.target.closest('.option')){
        if(songNode){
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if(e.target.closest('.option')){
          alert('option');
        }
      }
      
    }
  },
  defineProperties: function () {
    Object.defineProperty(
      this /**đối tượng đổ vào */,
      "currentSong" /**tên đồi tượng */,
      {
        get: function () {
          return this.song[this.currentIndex]; /**giá trị đổi vào */
        },
      }
    );
  },
  loadCurrentSong: function () {
    heading.innerText = this.currentSong.name;
    cd_thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.song.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }
    this.loadCurrentSong();
  },
  nextRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (randomSong.includes(newIndex));
    randomSong.push(newIndex);
    if (randomSong.length == this.song.length) {
      randomSong.splice(0, randomSong.length);
    }
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  prevRandomSong: function () {
    
    if(randomSong.length > 1){
      randomSong.pop();
      this.currentIndex = randomSong[randomSong.length - 1];
      this.loadCurrentSong();
    }
    else{
      this.currentIndex = 0;
      randomSong.splice(0, randomSong.length);
      this.loadCurrentSong();
    }
  },
  scrollToActiveSong: function () {
    if(this.currentIndex == 0){
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }else{
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  start: function () {
    // 
    this.loadConfig();

    //định nghĩa thuộc tính cho object
    this.defineProperties();

    //lắng nghe, xử lý các sự kiện (DOM)
    this.handleEvent();

    //Load thông tin bài hát đầu tiên vào UI khi chạy app
    this.loadCurrentSong();

    //render lại playlist
    this.render();

    
    !repeatBtn.classList.toggle("active", this.isRepeat);
    !randomBtn.classList.toggle("active", this.isRandom);
  },
};
app.start();
