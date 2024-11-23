(() => {

  let yOffset = 0; // window.scrollY; 대신 쓸 변수, 현재 스크롤 위치 저장
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합을 저장
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고 있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 씬이 시작된 순간 true 가 되는 변수


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
        messageA_opacity_in: [0,  1, {start: 0.1, end: 0.2}], // start, end -> 애니메이션이 재생되는 구간 설정 (비율)
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
      }
    },
    {
      // section 1
      type: 'normal',
     // heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅, type = normal에서는 필요없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
        content: document.querySelector('#scroll-section-1 .description')
      }
    },
    {
      // section 2
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin')
      },
      values: {
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
        messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
        messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
    }
    },
    {
      // section 3
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption')
      }
    }
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if(sceneInfo[i].type === 'sticky'){
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
      }else if (sceneInfo[i].type === 'normal'){
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
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
      const scrollHeight = sceneInfo[currentScene].scrollHeight;

      // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
      // const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
      const scrollRatio = currentYOffset / scrollHeight;

      if(values.length === 3){
        // start ~ end 사이에 애니메이션 실행

        const partScrollStart = values[2].start * scrollHeight;
        const partScrollEnd = values[2].end * scrollHeight;
        const partScrollHeight = partScrollEnd - partScrollStart

        if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
          // 부분 스크롤 영역의 비율이 반영되어야함
          rv = (currentYOffset   - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
        }else if(currentYOffset < partScrollStart){
          rv = values[0];
        }else if(currentYOffset > partScrollEnd){
          rv = values[1];
        }

      }else{
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        // 현재 씬의 전체 범위 에서
      }

      return rv;
  }


  // 애니메이션 동작 함수
  function playAnimation(){
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight; // 현재씬에서 얼마나 스크롤이 됐는지
    // const scrollRatio = yOffset / 현재 씬의 scrollHeight;

    switch(currentScene){
      case 0:
        // const messageA_opacity_in =  calcValues(values.messageA_opacity_in, currentYOffset);
        // const messageA_opacity_out =  calcValues(values.messageA_opacity_out, currentYOffset);
        // const messageA_translateY_in =  calcValues(values.messageA_translateY_in, currentYOffset);
        // const messageA_translateY_out =  calcValues(values.messageA_translateY_out, currentYOffset);
        // console.log(calcValues(values.messageA_opacity, currentYOffset));

        if (scrollRatio <= 0.22){
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
        } else{
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
        }
        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
      } else {
          // out
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
      }

      if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
      } else {
          // out
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
      }
      if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
      } else {
          // out
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
      }
        break;
        case 2:
            // console.log('2 play');
            if (scrollRatio <= 0.25) {
                // in
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
            }

            if (scrollRatio <= 0.57) {
                // in
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
            }

            if (scrollRatio <= 0.83) {
                // in
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            } else {
                // out
                objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
            }

            break;

        case 3:
            // console.log('3 play');
            break;
    }
  }

  // 스크롤 위치에 따라 현재 어떤 섹션이 활성화되어야하는 지?
  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0; // 현재 내 위치 기준으로 더 위쪽에 있는 scene의 scrollHeight -> 값이 누적이 되지 않도록
    for (let i = 0; i < currentScene; i++) {
      // prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 현재 스크롤 위치(yOffset)가 이전 장면들의 총 높이(prevScrollHeight)와 현재 장면의 높이(sceneInfo[currentScene].scrollHeight)의 합보다 크다면, 다음 section으로 이동
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    // 현재 스크롤 위치(yOffset)가 이전 장면들의 총 높이(prevScrollHeight)보다 작다면 이전 장면으로 돌아감 (currentScene--)
    if (yOffset < prevScrollHeight) {
      if (currentScene === 0) return; // 현재 장면이 첫 번째 장면(0)이 아닌 경우에만) - 스크롤 바운스로 아이폰의 경우, -1로 취급하여 이슈가 생길 수 있어 이를 방지하기 위해 넣어줌!!
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if(enterNewScene) return; // enterNewScene = true 라면 함수 종료

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

  let currentScroll = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentScroll = window.innerHeight - entry.boundingClientRect.top;
        console.log(currentScroll);
      }
    });
  });

  observer.observe(document.documentElement);  // 또는 특정 요소를 관찰할 수 있음
})(); // 지우지 말기