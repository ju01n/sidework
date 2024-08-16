(() => {

  let yOffset = 0; // window.scrollY; 대신 쓸 변수, 현재 스크롤 위치 저장
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)

// sceneInfo 배열 (각 섹션의 정보 저장)
  const sceneInfo = [
    {
      // section 0
      type : 'sticky',
      heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅 (디바이스마다 높이가 각 다르기때문에 고정값을 줘버리면 디바이스마다 같은 기능이 구현이 안될수도있다! )
      scrollHeight: 0, // 각 구간의 스크롤 높이 값 정보
      objs : {
        container : document.querySelector('#scroll-section-0')
      }
    },
    {
      // section 1
      type : 'normal',
      heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs : {
        container : document.querySelector('#scroll-section-1')
      }
    },
    {
      // section 2
      type : 'sticky',
      heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs : {
        container : document.querySelector('#scroll-section-2')
      }
    },
    {
      // section 3
      type : 'sticky',
      heightNum : 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs : {
        container : document.querySelector('#scroll-section-3')
      }
    }
  ];


// 스크롤 위치에 다라 현재 어떤 섹션이 활성화되어야하는 지 ㅌ
  function scrollLoop(){
    prevScrollHeight = 0; // 값이 누적이 되지 않도록
    for (let i = 0; i < currentScene; i++){
      // prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

   if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
    currentScene++;
   }
   if(yOffset < prevScrollHeight){
    if(currentScene === 0) return;
    currentScene--;
   }

   document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  window.addEventListener('resize', setLayout); // 윈도우 창 사이즈가 바뀌면 height도 함께 변동되게
  window.addEventListener('scroll', () => {
    yOffset = window.scrollY;
    scrollLoop();
  })

  setLayout();



})();