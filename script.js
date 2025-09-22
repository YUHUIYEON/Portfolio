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
    project.addEventListener('click', () => {
        currentProjectIndex = index;
        showProjectDetail();
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

    // 모달 열기
    projectDetail.classList.add('show');
    document.body.classList.add('project-detail-open');
    document.body.style.overflow = 'hidden';
}

// 프로젝트 상세 페이지 숨기기
function hideProjectDetail() {
    projectDetail.classList.add('closing');
    setTimeout(() => {
        projectDetail.classList.remove('show', 'closing');
        document.body.classList.remove('project-detail-open');
        document.body.style.overflow = 'auto';
    }, 600);
}

// 이전 프로젝트
function showPrevProject() {
    currentProjectIndex = currentProjectIndex > 0 ? currentProjectIndex - 1 : projectEls.length - 1;
    showProjectDetail();
}

// 다음 프로젝트
function showNextProject() {
    currentProjectIndex = currentProjectIndex < projectEls.length - 1 ? currentProjectIndex + 1 : 0;
    showProjectDetail();
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
