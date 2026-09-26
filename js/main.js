/* ============================================
   ПРИМЕНЕНИЕ ТЕМЫ СРАЗУ (до загрузки DOM)
   ============================================ */
(function() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();


/* ============================================
   ОСНОВНАЯ ЛОГИКА (после загрузки DOM)
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    /* ----- 1. Подгрузка шапки ----- */
    if (headerPlaceholder) {
        try {
            const response = await fetch('components/header.html');
            const html = await response.text();
            headerPlaceholder.innerHTML = html;

            highlightActiveLink();
            initMobileMenu();
            initSearch();
            initThemeToggle();
        } catch (e) {
            console.error('Не удалось загрузить шапку. Откройте сайт через локальный сервер.', e);
        }
    }

    /* ----- 2. Подгрузка футера ----- */
    if (footerPlaceholder) {
        try {
            const response = await fetch('components/footer.html');
            const html = await response.text();
            footerPlaceholder.innerHTML = html;
        } catch (e) {
            console.error('Не удалось загрузить футер.', e);
        }
    }
});


/* ============================================
   ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
   ============================================ */
function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('nav__link--active');
        }
    });
}


/* ============================================
   МОБИЛЬНОЕ МЕНЮ (бургер)
   ============================================ */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.nav__toggle');
    const nav = document.querySelector('.nav');

    if (!toggleBtn || !nav) return;

    /* Открытие / закрытие по клику на бургер */
    toggleBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggleBtn.classList.toggle('open');
    });

    /* Автоматическое закрытие меню при клике по ссылке */
    const navLinks = nav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            toggleBtn.classList.remove('open');
        });
    });
}


/* ============================================
   ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ (день/ночь)
   ============================================ */
function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });
}


/* ============================================
   ПОИСК ПО САЙТУ (десктоп + мобильный)
   ============================================ */
function initSearch() {
    // Общий список страниц для поиска
    const pages = [
        { url: 'index.html',          title: 'Главная',               keywords: 'главная арутюнян учитель математики информатики боровичи школа' },
        { url: 'about.html',          title: 'Обо мне',               keywords: 'образование герцена прикладная математика информатика стаж фгос классное руководство 8к космический точка роста егэ наставник' },
        { url: 'mathematics.html',    title: 'Математика',            keywords: 'алгебра геометрия огэ егэ олимпиада углублённое изучение' },
        { url: 'informatics.html',    title: 'Информатика',           keywords: 'программирование python scratch алгоритмы огэ егэ робототехника 3д моделирование vr квадрокоптер искусственный интеллект точка роста' },
        { url: 'achievements.html',   title: 'Достижения',            keywords: 'учитель года 2025 достижения грамоты сертификаты ученики грант' },
        { url: 'projects.html',       title: 'Проекты',               keywords: 'проекты музейный хаб' },
        { url: 'project-museum.html', title: 'Музейный хаб',          keywords: 'музейный хаб хакатон боровичи промышленность великая отечественная война виртуальная комната' },
        { url: 'contacts.html',       title: 'Контакты',              keywords: 'контакты телефон вк почта адрес школа боровичи' },
        { url: 'diplomas.html',       title: 'Грамоты',               keywords: 'грамоты' },
        { url: 'certificates.html',   title: 'Сертификаты',           keywords: 'сертификаты' },
        { url: 'students.html',       title: 'Достижения учеников',   keywords: 'достижения учеников' },
        { url: 'soon.html',           title: 'Скоро',                 keywords: 'скоро новые проекты' }
    ];

    /* --------------------------------------------
       ДЕСКТОПНЫЙ ПОИСК
       -------------------------------------------- */
    const toggleBtn = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const input = document.querySelector('.search-input');
    const results = document.querySelector('.search-results');

    if (toggleBtn && searchBox && input && results) {
        /* Открытие поиска по клику на иконку */
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                input.focus();
            } else {
                input.value = '';
                results.innerHTML = '';
                results.classList.remove('active');
            }
        });

        /* Поиск при вводе */
        input.addEventListener('input', () => {
            const query = input.value.trim().toLowerCase();
            results.innerHTML = '';

            if (query.length < 2) {
                results.classList.remove('active');
                return;
            }

            const matches = pages.filter(page => {
                return page.title.toLowerCase().includes(query) ||
                       page.keywords.toLowerCase().includes(query);
            });

            if (matches.length === 0) {
                results.innerHTML = '<div class="search-results__empty">Ничего не найдено</div>';
                results.classList.add('active');
                return;
            }

            matches.forEach(page => {
                const link = document.createElement('a');
                link.href = page.url;
                link.className = 'search-results__item';
                link.textContent = page.title;
                results.appendChild(link);
            });
            results.classList.add('active');
        });

        /* Закрытие поиска по клику вне */
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target) && !toggleBtn.contains(e.target)) {
                searchBox.classList.remove('active');
                results.classList.remove('active');
            }
        });
    }

    /* --------------------------------------------
       МОБИЛЬНЫЙ ПОИСК (внутри бургер-меню)
       -------------------------------------------- */
    const mobileInput = document.querySelector('.search-input-mobile');
    const mobileResults = document.querySelector('.search-results-mobile');

    if (mobileInput && mobileResults) {
        mobileInput.addEventListener('input', () => {
            const query = mobileInput.value.trim().toLowerCase();
            mobileResults.innerHTML = '';

            if (query.length < 2) {
                mobileResults.classList.remove('active');
                return;
            }

            const matches = pages.filter(page => {
                return page.title.toLowerCase().includes(query) ||
                       page.keywords.toLowerCase().includes(query);
            });

            if (matches.length === 0) {
                mobileResults.innerHTML = '<div class="search-results__empty">Ничего не найдено</div>';
                mobileResults.classList.add('active');
                return;
            }

            matches.forEach(page => {
                const link = document.createElement('a');
                link.href = page.url;
                link.className = 'search-results__item';
                link.textContent = page.title;
                mobileResults.appendChild(link);
            });
            mobileResults.classList.add('active');
        });
    }
}
