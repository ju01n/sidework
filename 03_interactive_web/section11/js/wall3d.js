(function () {
  const stageElem = document.querySelector('.stage');
  const houseElem = document.querySelector('.house');
  const barElem = document.querySelector('.progress-bar');
  const mousePos = { x: 0, y: 0 };
  let maxScrollValue;
  // 현재 창 사이즈 (전체 스크롤 할 수 있는 범위)

  // 바뀐 창 사이즈에 따라 리사이징
  function resizeHandler() {
    maxScrollValue = document.body.offsetHeight - window.innerHeight;
  }

  window.addEventListener('scroll', function () {
    const scrollPer = pageYOffset / maxScrollValue;
    // console.log(pageYOffset);
    // console.log(pageYOffset / maxScrollValue); // 이 비율에 따라 조정하면 될듯
    // 현재 창 사이즈 (전체 스크롤 할 수 있는 범위)
    const zMove = scrollPer * 980 - 490;
    // 490 : house 디폴트값이 -490이여서
    houseElem.style.transform = 'translateZ(' + zMove + 'vw)';

    // progress bar
    barElem.style.width = scrollPer * 100 + '%';
  });

  window.addEventListener('mousemove', function (e) {
    // console.log(e.clientX, e.clientY); // 마우스의 위치값

    mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
    mousePos.y = 1 - (e.clientY / window.innerHeight) * 2;
    // console.log(mousePos);
    stageElem.style.transform =
      'rotateX(' + mousePos.y * 5 + 'deg) rotateY(' + mousePos.x * 5 + 'deg)';
  });

  window.addEventListener('resize', resizeHandler);
  resizeHandler();
})(); // 지우지마
