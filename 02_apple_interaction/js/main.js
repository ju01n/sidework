// 전역변수 사용을 피하려고
(() => {
   const sceneInfo = [
    {
      // 각 브라우저, 기기가 가진 높이를 먼저 읽어 온 다음, 그 높이 X heightNum

      // 0
      type:'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll_section-0')
      }
    },
    {
      // 1
      type:'normal',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll_section-1')
      }
    },
    {
      // 2
      type:'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll_section-2')
      }
    },
    {
      // 3
      type:'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll_section-3')
      }
    }
   ];

   function setLayout(){
    //  각 스크롤 섹션의 높이 세팅
    for(let i = 0; i < sceneInfo.length; i++){
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    console.log(sceneInfo);
   }
   setLayout()


})(); // 지우지마