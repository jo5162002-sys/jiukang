/* Article media only: one muted inline player at a time, with native controls. */
(() => {
  const figures = [...document.querySelectorAll('.news-player')];
  const players = [];
  function status(figure, state, text) {
    figure.dataset.playbackState = state;
    figure.querySelector('.news-playback-status').textContent = text;
    figure.querySelector('.news-play-button').hidden = state === 'playing';
    if (state === 'playing') figure.dataset.hasPlayed = 'true';
  }
  function soundLabel(figure, muted) {
    const button = figure.querySelector('.news-sound-button');
    button.hidden = false;
    button.textContent = muted ? '開啟聲音' : '靜音';
    if (figure.dataset.playbackState === 'playing') {
      status(figure, 'playing', muted ? '正在播放（靜音）' : '正在播放');
    }
  }
  function playing(index, muted) {
    players.forEach((player, other) => { if (other !== index) player?.pause(); });
    status(figures[index], 'playing', muted ? '正在播放（靜音）' : '正在播放');
    soundLabel(figures[index], muted);
  }
  function ended(index) {
    status(figures[index], 'ended', '播放完畢');
    figures[index].querySelector('.news-play-button').textContent = '重新播放';
    players[index + 1]?.play();
  }
  function blocked(figure) {
    status(figure, 'blocked', '瀏覽器未允許自動播放，請按「播放影片」。');
  }
  const youtube = [];
  figures.forEach((figure, index) => {
    const play = figure.querySelector('.news-play-button');
    const sound = figure.querySelector('.news-sound-button');
    if (figure.dataset.kind === 'local') {
      const video = figure.querySelector('video');
      video.muted = true;
      const start = () => video.play().catch(error => {
        if (error.name === 'NotAllowedError') blocked(figure);
        else if (error.name !== 'AbortError') status(figure, 'error', '影片暫時無法播放，可使用下方「另開影片」。');
      });
      players[index] = { play: start, pause: () => { if (!video.paused) video.pause(); } };
      play.addEventListener('click', start);
      sound.addEventListener('click', () => { video.muted = !video.muted; });
      video.addEventListener('playing', () => playing(index, video.muted));
      video.addEventListener('pause', () => {
        if (!video.ended) status(figure, 'paused', '已暫停');
      });
      video.addEventListener('volumechange', () => soundLabel(figure, video.muted));
      video.addEventListener('ended', () => ended(index));
      video.addEventListener('error', () => status(figure, 'error', '影片暫時無法播放，可使用下方「另開影片」。'));
      soundLabel(figure, true);
      if (index === 0) start();
      return;
    }
    const iframe = figure.querySelector('iframe');
    const url = new URL(iframe.src);
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      url.searchParams.set('origin', location.origin);
      iframe.src = url.href;
    } else {
      status(figure, 'preview-needed', '請使用本機預覽網址開啟，才能在本頁播放 YouTube。');
    }
    youtube.push(() => {
      const player = new YT.Player(iframe.id, {
        events: {
          onReady: event => {
            event.target.mute();
            players[index] = {
              play: () => event.target.playVideo(),
              pause: () => {
                if ([1, 3].includes(event.target.getPlayerState())) event.target.pauseVideo();
              }
            };
            play.addEventListener('click', players[index].play);
            sound.addEventListener('click', () => {
              if (event.target.isMuted()) event.target.unMute();
              else event.target.mute();
              soundLabel(figure, event.target.isMuted());
            });
            soundLabel(figure, true);
            if (index === 0) players[index].play();
          },
          onStateChange: event => {
            if (event.data === 1) playing(index, event.target.isMuted());
            else if (event.data === 0) ended(index);
            else if (event.data === 2) status(figure, 'paused', '已暫停');
          },
          onAutoplayBlocked: () => blocked(figure),
          onError: event => {
            figure.dataset.playbackError = String(event.data);
            const message = event.data === 153
              ? '無法確認網頁來源，請以本機預覽網址開啟。'
              : 'YouTube 暫時無法在本頁播放，可使用下方「在 YouTube 開啟」。';
            status(figure, 'error', message);
          }
        }
      });
    });
  });
  if (youtube.length) {
    const ready = () => youtube.forEach(init => init());
    if (window.YT?.Player) ready();
    else {
      window.onYouTubeIframeAPIReady = ready;
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => figures.filter(f => f.dataset.kind === 'youtube').forEach(f => {
        status(f, 'error', 'YouTube 載入失敗，請重新整理或使用下方連結。');
      });
      document.head.append(script);
    }
  }
})();
