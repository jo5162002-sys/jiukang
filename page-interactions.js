(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if($('#opts')){

  var R={
    day:{t:'日間照顧',d:'白天在久康相聚、活動、好好用餐，傍晚回家，延續與家人的時光。適合有失能或失智情形、白天需要生活協助與陪伴的長輩。',go:'service.html'},
    home:{t:'居家照顧',d:'照顧服務員到府，依需求協助清潔、沐浴、更衣與備餐，尊重這個家原有的生活秩序。',go:'service-home.html'},
    night:{t:'臨時夜間住宿',d:'家人出差或需要休息時，可事先聯繫，安排臨時夜間住宿。使用前，我們會先了解長輩的作息與習慣。',go:'service-night.html'},
    unsure:{t:'先來聊聊',d:'不必先弄懂所有服務名稱。告訴我們長輩平常如何生活、哪些事需要幫忙，我們會說明適合進一步評估的方向。',go:null}
  };
  var vg=$$('#venn g');
  function showResult(k){
    var r=R[k]; if(!r) return;
    $$('#opts .opt').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.k===k?'true':'false')});
    vg.forEach(function(g){g.classList.toggle('on',g.dataset.k===k)});
    var h='<span class="chip">適合先了解</span><h3>'+r.t+'</h3><p>'+r.d+'</p><div class="cta">';
    if(r.go) h+='<a class="btn sage" href="'+r.go+'">看服務內容</a>';
    h+='<a class="btn ghost plain" href="tel:0423350395">來電諮詢</a></div>';
    $('#result').innerHTML=h;
  }
  $('#opts').addEventListener('click',function(e){var b=e.target.closest('.opt');if(b)showResult(b.dataset.k)});
  vg.forEach(function(g){g.addEventListener('click',function(){showResult(g.dataset.k)});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showResult(g.dataset.k)}})});
  showResult('day');


}
if($('#stage')){

  var S=[
    {w:'早晨',h:'相聚',t:'搭上接送車，或由家人陪同抵達。從一句問候與交流開始，慢慢進入一天的節奏。',tag:'日間照顧',s1:'#F3E4C2',s2:'#FBF3E2',gr:'#CBCB94',gr2:'#D9D8A6',tree:'#B4B878',sx:16,sy:62,sun:'#F2D98A',glow:'rgba(242,217,138,.55)',st:'#4A3D36',st2:'#6F6157',night:0,win:'#B9AE95'},
    {w:'上午',h:'伸展與活動',t:'依長輩狀況安排伸展與節奏律動，讓身體慢慢暖起來。想參與的人一起動一動，想先坐著看的人也有自己的位置。',tag:'日間照顧',s1:'#EDE9C8',s2:'#FAF6E6',gr:'#C5CB8C',gr2:'#D3D8A2',tree:'#A9B26E',sx:33,sy:34.5,sun:'#F4E6A0',glow:'rgba(244,230,160,.55)',st:'#4A3D36',st2:'#6F6157',night:0,win:'#B9AE95'},
    {w:'中午',h:'好好吃一餐',t:'坐下來，和身旁的人聊聊今天。午餐依長輩的咀嚼與吞嚥需要提供協助，餐後留一段自在休息的時間。',tag:'日間照顧',s1:'#E3EBC3',s2:'#F7F5E2',gr:'#BAC583',gr2:'#CAD394',tree:'#9DAA62',sx:50,sy:25,sun:'#FFF3B0',glow:'rgba(255,243,176,.6)',st:'#4A3D36',st2:'#6F6157',night:0,win:'#B9AE95'},
    {w:'午後',h:'手作、音樂與懷舊',t:'一起準備點心、整理盆栽，或在熟悉的老歌裡聊起從前。參與與否，由長輩自己決定。',tag:'日間照顧',s1:'#EBDFBF',s2:'#F7EEDA',gr:'#C2C285',gr2:'#D2D096',tree:'#A9AC69',sx:67,sy:33.5,sun:'#F2D39A',glow:'rgba(242,211,154,.55)',st:'#4A3D36',st2:'#6F6157',night:0,win:'#C9BC9C'},
    {w:'傍晚',h:'帶著今天的話題回家',t:'返家時，長輩帶回一天的見聞，家人也多了一段可以聊天的時間。',tag:'日間照顧',s1:'#E6C6A2',s2:'#F4E1C9',gr:'#B3B17C',gr2:'#C4C08D',tree:'#9A9B62',sx:84,sy:60,sun:'#E9A97C',glow:'rgba(233,169,124,.55)',st:'#4A3D36',st2:'#6A5A50',night:0,win:'#DDBB8B'},
    {w:'夜間',h:'需要時，安心過夜',t:'家人出差或需要休息時，可事先聯繫，安排臨時夜間住宿。使用前，我們會先了解長輩的作息與習慣。',tag:'臨時夜間住宿',s1:'#2A2320',s2:'#3E332E',gr:'#211B18',gr2:'#2A2320',tree:'#2F2A22',sx:72,sy:30,sun:'#EFE7D3',glow:'rgba(239,231,211,.28)',st:'#F1EAD9',st2:'#CFC3B3',night:1,win:'#F4D98B'}
  ];
  var stage=$('#stage'), sun=$('#sun'), moon=$('#moon'), rng=$('#t'), ticks=$('#ticks'), stars=$$('.star'), clouds=$$('.cloud'), arc=$('#arc');
  $('#ticks').replaceChildren();
  S.forEach(function(s,i){var b=document.createElement('button');b.type='button';b.textContent=s.w;b.addEventListener('click',function(){stopAuto();rng.value=i;setStage(i)});ticks.appendChild(b)});
  function setStage(i){
    var s=S[i], set=function(k,v){stage.style.setProperty(k,v)};
    set('--sky1',s.s1);set('--sky2',s.s2);set('--gr',s.gr);set('--gr2',s.gr2);set('--tree',s.tree);set('--st',s.st);set('--st2',s.st2);set('--win',s.win);
    sun.style.left=s.sx+'%';sun.style.top=s.sy+'%';sun.style.background=s.sun;sun.style.boxShadow='0 0 70px 24px '+s.glow;
    moon.style.opacity=s.night?'1':'0';moon.style.background=s.s1;
    stars.forEach(function(x){x.style.opacity=s.night?'.9':'0'});
    clouds.forEach(function(c){c.style.opacity=s.night?'.06':'.55'});
    arc.style.opacity=s.night?'0':'1';
    $('#when').textContent=s.w;$('#st-h').textContent=s.h;$('#st-t').textContent=s.t;$('#st-tag').textContent=s.tag;
    rng.setAttribute('aria-valuetext',s.w+'　'+s.h);
    $$('button',ticks).forEach(function(b,j){b.setAttribute('aria-current',j===i?'true':'false')});
  }
  var auto=null, autoDone=false;
  function stopAuto(){if(auto){clearInterval(auto);auto=null}autoDone=true}
  rng.addEventListener('input',function(){stopAuto();setStage(+rng.value)});
  setStage(+rng.value);
  if('IntersectionObserver' in window&&!reduce){
    var ao=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting&&!autoDone){ao.disconnect();var i=0;rng.value=0;setStage(0);
        auto=setInterval(function(){i++;if(i>5){stopAuto();return}rng.value=i;setStage(i)},1900);}
    })},{threshold:.55});
    ao.observe(stage);
  }


}
if($('#cal')){

  var CAT={move:['動一動','#A9B26E'],craft:['手作園藝','#B8946A'],music:['音樂懷舊','#D9B84F'],mind:['認知促進','#8FA3B0'],food:['飲食點心','#D9A088'],health:['健康講座','#7FB097'],event:['節慶特別','#C97F6A']};
  var CC={"am": "09:30–10:30", "closed": [], "extras": [{"cat": "event", "date": "2026-09-25", "desc": "DIY 柚子帽、品茶賞月，一起過節。", "name": "中秋團圓茶會", "slot": "pm"}, {"cat": "event", "date": "2026-10-16", "desc": "長輩才藝表演與家屬同樂。", "name": "重陽敬老活動", "slot": "pm"}, {"cat": "event", "date": "2026-12-22", "desc": "搓湯圓、煮甜湯，暖暖過冬至。", "name": "冬至搓湯圓", "slot": "pm"}, {"cat": "event", "date": "2027-02-04", "desc": "揮毫寫春聯，迎接新年。", "name": "新春迎福寫春聯", "slot": "pm"}], "pat": {"1": [["伸展暖身操", "move", "從頸肩到雙腳，跟著節奏慢慢動一動。"], ["園藝手作：盆栽照料", "craft", "澆水、修剪、換盆，照顧一盆屬於自己的綠意。"]], "2": [["律動健康操", "move", "配合輕快音樂，坐著也能做的全身律動。"], ["懷舊老歌會", "music", "唱起熟悉的老歌，聊聊那個年代的故事。"]], "3": [["認知促進遊戲", "mind", "記憶、辨識與配對，用遊戲活絡腦袋。"], ["手作點心時光", "food", "一起揉、捏、擺盤，完成後一起品嚐。"]], "4": [["肢體復能訓練", "move", "依長輩能力分組，維持肌力與平衡。"], ["音樂治療與擊樂", "music", "以節奏樂器與歌唱，帶動情緒與互動。"]], "5": [["桌遊與益智", "mind", "小組桌遊，練習專注、輪流與合作。"], ["生活分享與手作", "craft", "分享這週的小事，並完成一件小手作。"]]}, "pm": "14:00–15:30", "rules": [{"cat": "health", "desc": "血壓、用藥與日常保健小常識，歡迎家屬一起參加。", "name": "護理師健康講座", "nth": 1, "slot": "pm", "wd": 3}, {"cat": "event", "desc": "為當月壽星慶生，一起唱歌切蛋糕。", "name": "本月壽星慶生會", "nth": 3, "slot": "pm", "wd": 5}], "sample": true};
  function ds(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function isClosed(d){return CC.closed.indexOf(ds(d))>-1}
  function sessions(d){
    var w=d.getDay(); if(w<1||w>5||isClosed(d)) return [];
    var p=CC.pat[w]; if(!p) return [];
    var cell=[p[0],p[1]], nth=Math.ceil(d.getDate()/7), s=ds(d);
    function put(slot,name,cat,desc){cell[slot==='am'?0:1]=[name,cat,desc]}
    CC.rules.forEach(function(r){if(+r.wd===w&&+r.nth===nth)put(r.slot,r.name,r.cat,r.desc)});
    CC.extras.forEach(function(x){if(x.date===s)put(x.slot,x.name,x.cat,x.desc)});
    var out=[]; if(cell[0]&&cell[0][0]) out.push({t:CC.am,n:cell[0][0],c:cell[0][1],d:cell[0][2]||''}); if(cell[1]&&cell[1][0]) out.push({t:CC.pm,n:cell[1][0],c:cell[1][1],d:cell[1][2]||''});
    return out;
  }
  var cv=new Date(), cy=cv.getFullYear(), cm=cv.getMonth(), td=new Date(); while(td.getDay()===0||td.getDay()===6) td.setDate(td.getDate()+1); var sel=ds(td); cy=td.getFullYear(); cm=td.getMonth(), filt='all', todayS=ds(new Date());
  var WK=['日','一','二','三','四','五','六'];
  $('#lg').innerHTML='<button type="button" data-f="all" aria-pressed="true">全部</button>'+Object.keys(CAT).map(function(k){return '<button type="button" data-f="'+k+'" aria-pressed="false" style="--cc:'+CAT[k][1]+'"><i></i>'+CAT[k][0]+'</button>'}).join('');
  function gcal(d,s){
    var a=s.t.split('–'), day=ds(d).replace(/-/g,''), f=function(x){return day+'T'+x.replace(':','')+'00'};
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('久康日間照顧｜'+s.n)+'&dates='+f(a[0])+'/'+f(a[1])+'&details='+encodeURIComponent(s.d)+'&location='+encodeURIComponent('臺中市烏日區溪南路二段347巷51弄86號')+'&ctz=Asia/Taipei';
  }
  function drawCal(){
    var first=new Date(cy,cm,1), start=(first.getDay()+6)%7, days=new Date(cy,cm+1,0).getDate();
    $('#mlabel').textContent=cy+' 年 '+(cm+1)+' 月';
    var h=['一','二','三','四','五','六','日'].map(function(x){return '<div class="wd" role="columnheader">'+x+'</div>'}).join('');
    for(var i=0;i<start;i++) h+='<div class="day out off" aria-hidden="true"></div>';
    for(var n=1;n<=days;n++){
      var d=new Date(cy,cm,n), s=ds(d), ss=sessions(d).filter(function(x){return filt==='all'||x.c===filt}), off=d.getDay()===0||d.getDay()===6||isClosed(d);
      var cls='day'+(off?' off':'')+(s===todayS?' today':'')+(s===sel?' sel':'');
      h+='<button type="button" class="'+cls+'" data-d="'+s+'"'+(off?' disabled':'')+' role="gridcell" aria-label="'+(cm+1)+'月'+n+'日'+(off?' 休':'，'+ss.length+' 堂課')+'"><span class="n">'+n+'</span>'
        +ss.map(function(x){return '<span class="ev" style="--cc:'+CAT[x.c][1]+'"><i></i><span>'+x.n+'</span></span>'}).join('')+'</button>';
    }
    var tail=(7-((start+days)%7))%7; for(i=0;i<tail;i++) h+='<div class="day out off" aria-hidden="true"></div>';
    $('#cal').innerHTML=h;
  }
  function drawDay(){
    var p=sel.split('-'), d=new Date(+p[0],+p[1]-1,+p[2]), ss=sessions(d).filter(function(x){return filt==='all'||x.c===filt});
    var h='<div class="wk">星期'+WK[d.getDay()]+'</div><div class="dt num">'+(d.getMonth()+1)+' 月 '+d.getDate()+' 日</div>';
    if(isClosed(d)) h+='<p class="none">這一天休館。</p>';
    else if(d.getDay()===0||d.getDay()===6) h+='<p class="none">週末休息，日間服務為週一至週五。</p>';
    else{
      h+='<div class="ses">'+(ss.length?ss.map(function(x){return '<div class="s" style="--cc:'+CAT[x.c][1]+'"><span class="tm">'+x.t+'</span><h3><i></i>'+x.n+'</h3><p>'+x.d+'</p><a href="'+gcal(d,x)+'" target="_blank" rel="noopener">加入 Google 日曆 ↗</a></div>'}).join(''):'<p class="none">這一天沒有符合篩選的課程。</p>')+'</div>';
      h+='<p class="base">每日皆有：晨間相聚、午餐與午休。實際時程依長輩狀況調整。</p>';
    }
    $('#dayp').innerHTML=h;
  }
  function drawAll(){drawCal();drawDay()}
  $('#cal').addEventListener('click',function(e){var b=e.target.closest('.day[data-d]');if(!b||b.disabled)return;sel=b.dataset.d;drawAll()});
  $('#lg').addEventListener('click',function(e){var b=e.target.closest('button[data-f]');if(!b)return;filt=b.dataset.f;$$('#lg button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});drawAll()});
  function shift(m){cm+=m;if(cm<0){cm=11;cy--}if(cm>11){cm=0;cy++}var f=new Date(cy,cm,1);while(f.getDay()===0||f.getDay()===6)f.setDate(f.getDate()+1);sel=ds(f);drawAll()}
  $('#mprev').addEventListener('click',function(){shift(-1)});$('#mnext').addEventListener('click',function(){shift(1)});
  $('#mtoday').addEventListener('click',function(){var t=new Date();while(t.getDay()===0||t.getDay()===6)t.setDate(t.getDate()+1);cy=t.getFullYear();cm=t.getMonth();sel=ds(t);drawAll()});
  drawAll();

}
})();