(() => {
  const hand = document.querySelector('.hand');
  const leaflet = document.querySelector('.leaflet');
  const pageElems = document.querySelectorAll('.page');
  let pageCount = 0;
  let currentMenu;

  const handPos = {x:0, y:0}; // 현재 손의 위치
  const targetPos = {x:0, y:0}; // 타켓 위치(마우스 위치)
  let distX; // 마우스와 손의 x거리
  let distY; // 마우스와 손의 y거리

  // 범용적으로 쓰기
  function getTarget(elem, className){
        while(!elem.classList.contains(className)){
          elem = elem.parentNode;

      if(elem.nodeName == 'BODY'){
        elem = null;
        return;
      }
    }
    return elem;
  }

// 리플릿 닫는 함수
  function closeLeaflet(){
    pageCount = 0;
    document.body.classList.remove('leaflet_opened');
    leaflet.classList.remove('is_active');
    pageElems[2].classList.remove('page_flipped');
    setTimeout(() => {
      pageElems[0].classList.remove('page_flipped');
    }, 500);
  }

// zoomin 함수
function zoomIn(elem) {
  const rect = elem.getBoundingClientRect();
  // console.log(rect.left, rect.top);
  const dx = window.innerWidth/2 - (rect.x + rect.width/2);
  const dy = window.innerHeight/2 - (rect.y + rect.height/2);
  let angle;

  switch (elem.parentNode.parentNode.parentNode.dataset.page * 1) {// data-page의 숫자에 따라 앵글 바꿈, *1 해주면 문자열이 숫자로 바뀜
    case 1:
      angle = -30;
      break;
    case 2:
      angle = 0;
      break;
    case 3:
      angle = 30;
      break;
  }

  document.body.classList.add('zoom_in');
  leaflet.style.transform = `translate3d(${dx}px, ${dy}px, 50vw) rotateY(${angle}deg)`;
  currentMenu = elem;
  currentMenu.classList.add('current_menu'); // 클릭한 메뉴아이템에 클래스 부여
}

// zoomOut 함수
function zoomOut() {
  leaflet.style.transform = 'translate3d(0, 0, 0)';
  if (currentMenu) {
    document.body.classList.remove('zoom_in');
    currentMenu.classList.remove('current_menu');
    currentMenu = null;
  }
}

function render(){
  distX = targetPos.x - handPos.x;
  distY = targetPos.y - handPos.y;
  handPos.x = handPos.x + distX * 0.1;
  handPos.y = handPos.y + distY * 0.1;
  hand.style.transform = `translate(${handPos.x - 60}px, ${handPos.y + 30}px)`
  requestAnimationFrame(render);
}
render();

  leaflet.addEventListener('click', e => {
    let pageElem = getTarget(e.target, 'page')
    if (pageElem){
      pageElem.classList.add('page_flipped');
      pageCount++; // page를 넘길 때 마다 1씩 증가해주어야함

      if(pageCount == 2){ // page가 2번 펼쳐질 때
        document.body.classList.add('leaflet_opened');
        setTimeout(() => {
          leaflet.classList.add('is_active');
        }, 500);
      }
    }

    let closeBtnElem = getTarget(e.target, 'btn_close');
    if(closeBtnElem){ // 'close-btn'클릭 시 페이지 초기화(pageCount, .leaflet-opened 클래스 제거..)
      closeLeaflet();
      zoomOut();
    }
    let menuItemElem = getTarget(e.target, 'info_item');
    if (!document.body.classList.contains('zoom_in')) {
      zoomIn(menuItemElem);
    }
    // while(!pageElem.classList.contains('page')){
    //   pageElem = pageElem.parentNode;

    //   if(pageElem.nodeName == 'BODY'){
    //     pageElem = null;
    //     return;
    //   }
    // }

    // console.log(pageElem);
    let backBtn = getTarget(e.target, 'btn_back');
    if(backBtn){
      zoomOut();
    }
  });

  // 처음 시작 시 리플릿 애니메이션 끝난 후 없애기 -> transform 충돌때문에 
  leaflet.addEventListener('animationend', () => {
    leaflet.style.animation = 'none';
  });

  window.addEventListener('mousemove', e => {
    // console.log(e.clientX, e.clientY);
    // hand.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    targetPos.x = e.clientX - window.innerWidth * 0.7; // 마우스 디폴트 위치값 조정하여 targetPos도 조정
    targetPos.y = e.clientY - window.innerHeight * 0.7;
  })


})();