/*
JavaScript Document
TemplateMo 615 Amber Folio
Optimized Coverflow
Mobile + Desktop
*/

class PhotoCoverflow {

    constructor() {

        this.items =
            document.querySelectorAll('.coverflow-item');

        this.indicators =
            document.querySelectorAll('.indicator');

        this.totalItems =
            this.items.length;

        this.currentIndex =
            Math.min(2, this.totalItems - 1);

        this.isPlaying = false;

        this.autoPlayInterval = null;

        this.autoPlaySpeed = 5000;

        if (!this.totalItems) return;

        this.init();
    }


    init() {

        this.updateCoverflow();

        this.bindEvents();

    }


    bindEvents() {

        const prevBtn =
            document.getElementById('prevBtn');

        const nextBtn =
            document.getElementById('nextBtn');

        const playPauseBtn =
            document.getElementById('playPauseBtn');

        const container =
            document.getElementById('coverflowContainer');


        /* Previous */

        if (prevBtn) {

            prevBtn.addEventListener(
                'click',
                () => this.prev()
            );

        }


        /* Next */

        if (nextBtn) {

            nextBtn.addEventListener(
                'click',
                () => this.next()
            );

        }


        /* Play */

        if (playPauseBtn) {

            playPauseBtn.addEventListener(
                'click',
                () => this.toggleAutoPlay()
            );

        }


        /* Indicators */

        this.indicators.forEach(
            (indicator, index) => {

                indicator.addEventListener(
                    'click',
                    () => this.goTo(index)
                );

            }
        );


        /* Image clicks */

        this.items.forEach(
            (item, index) => {

                item.addEventListener(
                    'click',
                    () => {

                        if (
                            index !==
                            this.currentIndex
                        ) {

                            this.goTo(index);

                        }

                    }
                );

            }
        );


        /* Keyboard */

        document.addEventListener(
            'keydown',
            (e) => {

                if (e.key === 'ArrowLeft') {
                    this.prev();
                }

                if (e.key === 'ArrowRight') {
                    this.next();
                }

                if (e.key === ' ') {

                    e.preventDefault();

                    this.toggleAutoPlay();

                }

            }
        );


        /* =========================
           TOUCH SWIPE
           ========================= */

        if (container) {

            let startX = 0;
            let startY = 0;

            container.addEventListener(
                'touchstart',
                (e) => {

                    startX =
                        e.touches[0].clientX;

                    startY =
                        e.touches[0].clientY;

                },
                {
                    passive: true
                }
            );


            container.addEventListener(
                'touchend',
                (e) => {

                    const endX =
                        e.changedTouches[0].clientX;

                    const endY =
                        e.changedTouches[0].clientY;

                    const diffX =
                        startX - endX;

                    const diffY =
                        startY - endY;


                    if (
                        Math.abs(diffX) >
                            Math.abs(diffY) &&
                        Math.abs(diffX) > 45
                    ) {

                        if (diffX > 0) {

                            this.next();

                        } else {

                            this.prev();

                        }

                    }


                    startX = 0;
                    startY = 0;

                },
                {
                    passive: true
                }
            );

        }


        /* =========================
           RESIZE
           ========================= */

        let resizeTimer;

        window.addEventListener(
            'resize',
            () => {

                clearTimeout(resizeTimer);

                resizeTimer = setTimeout(
                    () => {

                        this.updateCoverflow();

                    },
                    150
                );

            }
        );

    }


    /* =========================
       UPDATE COVERFLOW
       ========================= */

    updateCoverflow() {

        const width =
            window.innerWidth;

        const isMobile =
            width <= 768;

        const isSmallMobile =
            width <= 480;


        let spacing;

        if (isSmallMobile) {

            spacing = 105;

        } else if (isMobile) {

            spacing = 130;

        } else {

            spacing = 220;

        }


        this.items.forEach(
            (item, index) => {

                let offset =
                    index -
                    this.currentIndex;


                /* Loop */

                if (
                    offset >
                    this.totalItems / 2
                ) {

                    offset -=
                        this.totalItems;

                }


                if (
                    offset <
                    -this.totalItems / 2
                ) {

                    offset +=
                        this.totalItems;

                }


                let translateX =
                    offset * spacing;

                let translateZ = 0;

                let rotateY = 0;

                let scale = 1;

                let opacity = 1;


                /* CENTER */

                if (offset === 0) {

                    scale =
                        isMobile
                            ? 1.03
                            : 1.08;

                    translateZ =
                        isMobile
                            ? 25
                            : 80;

                    opacity = 1;

                }


                /* LEFT / RIGHT */

                else if (
                    Math.abs(offset) === 1
                ) {

                    scale =
                        isMobile
                            ? 0.88
                            : 0.85;

                    opacity =
                        isMobile
                            ? 0.65
                            : 0.7;

                    rotateY =
                        isMobile
                            ? offset * -12
                            : offset * -35;

                }


                /* SECOND */

                else if (
                    Math.abs(offset) === 2
                ) {

                    scale =
                        isMobile
                            ? 0.7
                            : 0.7;

                    opacity =
                        isMobile
                            ? 0.25
                            : 0.45;

                    rotateY =
                        isMobile
                            ? offset * -15
                            : offset * -45;

                    translateZ =
                        isMobile
                            ? -10
                            : -70;

                }


                /* HIDDEN */

                else {

                    scale =
                        isMobile
                            ? 0.55
                            : 0.5;

                    opacity =
                        isMobile
                            ? 0
                            : 0.15;

                    translateZ =
                        isMobile
                            ? 0
                            : -130;

                    rotateY =
                        isMobile
                            ? offset * -8
                            : offset * -50;

                }


                item.style.transform =
                    `translate(-50%, -50%) ` +
                    `translateX(${translateX}px) ` +
                    `translateZ(${translateZ}px) ` +
                    `rotateY(${rotateY}deg) ` +
                    `scale(${scale})`;


                item.style.opacity =
                    opacity;


                item.style.zIndex =
                    this.totalItems -
                    Math.abs(offset);

            }
        );


        /* Indicators */

        this.indicators.forEach(
            (indicator, index) => {

                indicator.classList.toggle(
                    'active',
                    index ===
                    this.currentIndex
                );

            }
        );

    }


    /* =========================
       AUTOPLAY
       ========================= */

    toggleAutoPlay() {

        const button =
            document.getElementById(
                'playPauseBtn'
            );


        if (this.isPlaying) {

            this.stopAutoPlay();

            if (button) {

                button.innerHTML = '▶';

                button.classList.remove(
                    'playing'
                );

            }

        } else {

            this.startAutoPlay();

            if (button) {

                button.innerHTML = '❚❚';

                button.classList.add(
                    'playing'
                );

            }

        }

    }


    startAutoPlay() {

        this.isPlaying = true;


        this.autoPlayInterval =
            setInterval(
                () => {

                    this.next();

                },
                this.autoPlaySpeed
            );

    }


    stopAutoPlay() {

        this.isPlaying = false;


        if (this.autoPlayInterval) {

            clearInterval(
                this.autoPlayInterval
            );

            this.autoPlayInterval = null;

        }

    }


    prev() {

        this.currentIndex =
            (
                this.currentIndex -
                1 +
                this.totalItems
            ) %
            this.totalItems;


        this.updateCoverflow();

    }


    next() {

        this.currentIndex =
            (
                this.currentIndex +
                1
            ) %
            this.totalItems;


        this.updateCoverflow();

    }


    goTo(index) {

        if (
            index < 0 ||
            index >= this.totalItems
        ) {
            return;
        }


        this.currentIndex =
            index;


        this.updateCoverflow();

    }

}


/* =========================================
   DOM READY
   ========================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {


        /* Coverflow */

        new PhotoCoverflow();


        /* Loading Screen */

        const loadingScreen =
            document.getElementById(
                'loadingScreen'
            );


        if (loadingScreen) {

            requestAnimationFrame(
                () => {

                    loadingScreen.classList.add(
                        'hidden'
                    );

                }
            );

        }


        /* Header */

        const header =
            document.getElementById(
                'header'
            );


        let scrollTicking = false;


        window.addEventListener(
            'scroll',
            () => {

                if (scrollTicking) return;


                window.requestAnimationFrame(
                    () => {

                        if (header) {

                            header.classList.toggle(
                                'scrolled',
                                window.scrollY > 50
                            );

                        }


                        scrollTicking = false;

                    }
                );


                scrollTicking = true;

            },
            {
                passive: true
            }
        );


        /* Mobile menu */

        const menuToggle =
            document.getElementById(
                'menuToggle'
            );

        const navMenu =
            document.getElementById(
                'navMenu'
            );


        if (
            menuToggle &&
            navMenu
        ) {

            menuToggle.addEventListener(
                'click',
                () => {

                    menuToggle.classList.toggle(
                        'active'
                    );

                    navMenu.classList.toggle(
                        'active'
                    );

                }
            );


            document
                .querySelectorAll(
                    '.nav-menu a'
                )
                .forEach(
                    link => {

                        link.addEventListener(
                            'click',
                            () => {

                                menuToggle.classList.remove(
                                    'active'
                                );

                                navMenu.classList.remove(
                                    'active'
                                );

                            }
                        );

                    }
                );

        }


        /* Smooth scrolling */

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(
                anchor => {

                    anchor.addEventListener(
                        'click',
                        function (e) {

                            const target =
                                document.querySelector(
                                    this.getAttribute(
                                        'href'
                                    )
                                );


                            if (!target) return;


                            e.preventDefault();


                            target.scrollIntoView(
                                {
                                    behavior: 'smooth',
                                    block: 'start'
                                }
                            );

                        }
                    );

                }
            );


        /* Reveal animation */

        const revealElements =
            document.querySelectorAll(
                '.reveal'
            );


        if (
            'IntersectionObserver'
            in window
        ) {

            const observer =
                new IntersectionObserver(
                    (entries) => {

                        entries.forEach(
                            entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        'active'
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );

                                }

                            }
                        );

                    },
                    {
                        rootMargin:
                            '0px 0px -80px 0px'
                    }
                );


            revealElements.forEach(
                element => {

                    observer.observe(
                        element
                    );

                }
            );

        } else {

            revealElements.forEach(
                element => {

                    element.classList.add(
                        'active'
                    );

                }
            );

        }

    }
);