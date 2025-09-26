// 새로고침 시 맨 위로
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// GSAP scrollTrigger - nav 메뉴 이동 효과
let links = gsap.utils.toArray("#parallax_nav ul li a");

links.forEach(link => {
    let element = document.querySelector(link.getAttribute("href"));

    ScrollTrigger.create({
        trigger: element,
        start: "top center",
        end: "bottom center",
        onToggle: self => setActive(link)
    });

    link.addEventListener("click", e => {
        e.preventDefault();
        setActive(link);          
        gsap.to(window, {
        duration: 0.7,
        scrollTo: element,
        overwrite: "auto",
        ease: "power2.out"
        });
    })
});

function setActive(link){
    links.forEach(el => el.classList.remove("active"));
    link.classList.add("active");
}

// 현재 프로젝트 index
let currentProjectIndex = 0;

// 프로젝트 상세 페이지 요소들
const projectDetail = document.getElementById('project-detail');
const detailTitle = document.getElementById('detail-title');
const detailDescription = document.getElementById('detail-description');
const detailLaunch = document.getElementById('detail-launch');
const prevButton = document.getElementById('prev-project');
const nextButton = document.getElementById('next-project');
const closeButton = document.getElementById('close-detail');

// 모든 프로젝트 DOM 요소
const projectEls = document.querySelectorAll('.project');

// 프로젝트 클릭 이벤트
projectEls.forEach((project, index) => {
    project.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // 모바일 감지
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 모바일에서는 hover 효과가 완료된 후 상세페이지 표시
            project.classList.add('clicked');
            project.style.pointerEvents = 'none';
            
            // hover 애니메이션 완료 후 상세페이지 표시 (0.2초 후)
            setTimeout(() => {
                currentProjectIndex = index;
                showProjectDetail();
            }, 200);
        } else {
            // 웹에서는 즉시 상세페이지 표시
            project.classList.add('clicked');
            project.style.pointerEvents = 'none';
            
            currentProjectIndex = index;
            showProjectDetail();
        }
    });
});

// HTML에서 데이터 읽어서 모달에 표시
function showProjectDetail() {
    const projectEl = projectEls[currentProjectIndex];

    // 제목
    const title = projectEl.querySelector('.title-original').textContent;
    detailTitle.textContent = title;

    // 설명 (예: "2025 / Webdesign / Development / Branding")
    const descText = projectEl.querySelector('p').textContent.split(" / ");
    const year = descText[0];
    const categories = descText.slice(1);

    // 연도
    const yearElement = detailDescription.querySelector('.info-year');
    yearElement.textContent = year;

    // 카테고리
    const categoryElements = detailDescription.querySelectorAll('.info-category');
    categories.forEach((cat, i) => {
        if (categoryElements[i]) {
            categoryElements[i].textContent = cat;
        }
    });

    // 링크
    const link = projectEl.querySelector('a').href;
    detailLaunch.href = link;
    detailLaunch.setAttribute("target", "_blank");

    // 이미지
    const imgSrc = projectEl.getAttribute('data-image');
    const placeholder = document.querySelector('.project-image-placeholder');
    if(imgSrc) {
        placeholder.innerHTML = `<img src="${imgSrc}" alt="프로젝트 이미지" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
        placeholder.innerHTML = '';
    }

    // 모달 열기(전환 애니메이션 지원)
    projectDetail.classList.remove('show', 'closing');
    projectDetail.style.display = 'block';
    
    // 브라우저가 display 변경을 인식할 수 있도록 약간의 딜레이
    setTimeout(() => {
        projectDetail.classList.add('show');
        document.body.classList.add('project-detail-open');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }, 10);
}

// 프로젝트 상세 페이지 숨기기
function hideProjectDetail() {
    projectDetail.classList.add('closing');
    setTimeout(() => {
        projectDetail.classList.remove('show', 'closing');
        projectDetail.style.display = 'none';
        document.body.classList.remove('project-detail-open');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // 클릭된 프로젝트 상태 복원
        const clickedProject = document.querySelector('.project.clicked');
        if (clickedProject) {
            clickedProject.classList.remove('clicked');
            clickedProject.style.pointerEvents = 'auto';
        }
    }, 600);
}

// 이전 프로젝트
function showPrevProject() {
    // 상세페이지 왼쪽으로 사라지기
    projectDetail.classList.add('closing');
    
    setTimeout(() => {
        // 이전 클릭 상태 제거
        const clickedProject = document.querySelector('.project.clicked');
        if (clickedProject) {
            clickedProject.classList.remove('clicked');
            clickedProject.style.pointerEvents = 'auto';
        }
        
        currentProjectIndex = currentProjectIndex > 0 ? currentProjectIndex - 1 : projectEls.length - 1;
        
        // 왼쪽으로 사라진 후 오른쪽에서 나타나기
        setTimeout(() => {
            projectDetail.classList.remove('closing');
            showProjectDetail();
        }, 100);
    }, 400);
}

// 다음 프로젝트
function showNextProject() {
    // 상세페이지 왼쪽으로 사라지기
    projectDetail.classList.add('closing');
    
    setTimeout(() => {
        // 이전 클릭 상태 제거
        const clickedProject = document.querySelector('.project.clicked');
        if (clickedProject) {
            clickedProject.classList.remove('clicked');
            clickedProject.style.pointerEvents = 'auto';
        }
        
        currentProjectIndex = currentProjectIndex < projectEls.length - 1 ? currentProjectIndex + 1 : 0;
        
        // 왼쪽으로 사라진 후 오른쪽에서 나타나기
        setTimeout(() => {
            projectDetail.classList.remove('closing');
            showProjectDetail();
        }, 100);
    }, 400);
}

// 이벤트 리스너
closeButton.addEventListener('click', hideProjectDetail);
prevButton.addEventListener('click', showPrevProject);
nextButton.addEventListener('click', showNextProject);

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectDetail.classList.contains('show')) {
        hideProjectDetail();
    }
});

// 모바일 nav-button 클릭 후 포커스 잔상 방지 (약간의 딜레이로 자연스럽게)
document.querySelectorAll('.nav-button').forEach(btn => {
    btn.addEventListener('touchend', function() {
        setTimeout(() => this.blur(), 100);
    });
    btn.addEventListener('mouseup', function() {
        setTimeout(() => this.blur(), 100);
    });
});