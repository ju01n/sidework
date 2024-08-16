(() => {

  let yOffset = 0; // window.scrollY; 대신 쓸 변수, 현재 스크롤 위치 저장
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합을 저장
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)

  // sceneInfo 배열 (각 섹션의 정보 저장)
  const sceneInfo = [{
      // section 0
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 (디바이스마다 높이가 각 다르기때문에 고정값을 줘버리면 디바이스마다 같은 기능이 구현이 안될수도있다!)
      scrollHeight: 0, // 각 구간의 스크롤 높이 값 정보
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA : document.querySelector('#scroll-section-0 .main-message.a'),
        messageB : document.querySelector('#scroll-section-1 .main-message.b'),
        messageC : document.querySelector('#scroll-section-2 .main-message.c'),
        messageD : document.querySelector('#scroll-section-3 .main-message.d')
      },
      values: {
        messageA_opacity: [0,  1]
      }
    },
    {
      // section 1
      type: 'normal',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      }
    },
    {
      // section 2
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      }
    },
    {
      // section 3
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      }
    }
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++){ // sceneInfo 배열을 순회하면서 각 장면의 높이를 누적
      totalScrollHeight += sceneInfo[i].scrollHeight; // 각 장편의 높이를 totalScrollHeight에 더함
      // 현재 스크룰 위치와 비교
      if(totalScrollHeight >= yOffset){ // 현재 스크롤 위치보다 totalScrollHeight가 크거나 같아졌을때 멈춤
        // 누적된 높이가 현재 스크롤 위치보다 크거나 같으면, 해당 장면이 현재 보이는 장면임
        currentScene = i; // 현재 장면 번호를 currentScene에 저장
        break; // 현재 장면 찾았으므로 종료 
      }
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset){ 
      // currentYOffset : 현재 씬에서 얼마나 스크롤됐는지 ? 

      let rv;
      // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
      let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

      rv = scrollRatio * (values[1] - values[0]) + values[0];  

      return rv;
  }


  // 애니메이션 동작 함수
  function playAnimation(){
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;

    switch(currentScene){
      case 0:
        let messageA_opacity_in =  calcValues(values.messageA_opacity, currentYOffset);
        // console.log(calcValues(values.messageA_opacity, currentYOffset));
        objs.messageA.style.opacity = messageA_opacity_in;
        break;
      case 1: 

        break;
      case 2:

        break;
      case 3:

        break
    }
  }

  // 스크롤 위치에 따라 현재 어떤 섹션이 활성화되어야하는 지?
  function scrollLoop() {
    prevScrollHeight = 0; // 현재 내 위치 기준으로 더 위쪽에 있는 scene의 scrollHeight -> 값이 누적이 되지 않도록
    for (let i = 0; i < currentScene; i++) {
      // prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 현재 스크롤 위치(yOffset)가 이전 장면들의 총 높이(prevScrollHeight)와 현재 장면의 높이(sceneInfo[currentScene].scrollHeight)의 합보다 크다면, 다음 section으로 이동
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
    }
    // 현재 스크롤 위치(yOffset)가 이전 장면들의 총 높이(prevScrollHeight)보다 작다면 이전 장면으로 돌아감 (currentScene--)
    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return; // 현재 장면이 첫 번째 장면(0)이 아닌 경우에만) - 스크롤 바운스로 아이폰의 경우, -1로 취급하여 이슈가 생길 수 있어 이를 방지하기 위해 넣어줌!!
      currentScene--;
    } 
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    playAnimation();
  }


  window.addEventListener('scroll', () => {
    yOffset = window.scrollY;
    scrollLoop();
  });
  // window.addEventListener('DOMContentLoaded', setLayout); -> 이렇게 써도 무방
  window.addEventListener('load', setLayout);
  /* 
  - load : 웹페이지에 있는 이미지까지 모두 로드가 되고 실행
  - DOMContentLoaded : DOM content만 로드되면 실행
  */

  window.addEventListener('resize', setLayout);  // 윈도우 창 사이즈가 바뀌면 height도 함께 변동되게

  setLayout();



})(); // 지우지 말기