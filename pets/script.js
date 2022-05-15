document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementsByTagName('body')[0];
    const window_width = document.documentElement.clientWidth;
    const pets_cards = document.getElementById('pets_cards');

    const pag_first = document.getElementById('pag_first');
    const pag_prev = document.getElementById('pag_prev');
    const pag_num = document.getElementById('pag_num');
    const pag_next = document.getElementById('pag_next');
    const pag_last = document.getElementById('pag_last');

    let currentPage = 0;
    let count_element = 8;        
    if(window_width >=768 && window_width < 1280) {
        count_element = 6;
    } else if(window_width < 767) {
        count_element = 3;
    }

    let pages = [];

    const cardClickHandler = (e) => {
        const card = e.target.closest('.our_card');
        if(card) {
            modal_opener(card.dataset.id)
        }
    }

    pets_cards.addEventListener('click', cardClickHandler);

    fetch('https://rolling-scopes-school.github.io/snake911-JSFE2022Q1/shelter/pets.json')
        .then(res => res.json())
        .then(res => {
            pages = generateBigArray(res);
            drawCards(pages, currentPage);
            changePagination();
        })
        .catch(error => console.log(error));

    const generateBigArray = (array) => {
        let result = [];
        for(let i = 0; i < 6; i++) {
            result = result.concat(array)
        }
        return generateArrayPages(result);
    }   

    const generateArrayPages = (bigArray) => {
        const newPages = [];
        const count_page = bigArray.length / count_element;
        let currentSize = 0;
        for(let i = 0; i < count_page; i++) {
            const usedNames = [];
            const page = [];
            for(let j = 0; j < count_element; j++, currentSize++) {
                let index = Math.floor(Math.random() * (bigArray.length));
                while(usedNames.includes(bigArray[index].name)) {
                    index = Math.floor(Math.random() * (bigArray.length));
                }
                usedNames.push(bigArray[index].name);
                page.push(bigArray[index]);
            }
            newPages.push(page);
        }
        return newPages;
    }

    const drawCards = (array, page) => {
        let cards = '';
        for(let i = 0; i < count_element; i++) {
            cards += `
            <div class="our_card" data-id="${i}">
                <div class="card_img">
                    <img src=".${array[page][i].img}" alt="${array[page][i].name}">
                </div>
                <div class="card_name">${array[page][i].name}</div>
                <button class="button_secondary">Learn more</button>
            </div>
            `;
        }
        pets_cards.innerHTML = cards;
        changePagination();
    }

    const changePagination = () => {
        pag_num.innerText = currentPage + 1;
        if(currentPage == 0) {
            pag_first.classList.add('inactive');
            pag_prev.classList.add('inactive');
        } else {
            pag_first.classList.remove('inactive');
            pag_prev.classList.remove('inactive');
        }

        if(currentPage == pages.length - 1) {
            pag_next.classList.add('inactive');
            pag_last.classList.add('inactive');
        } else {
            pag_next.classList.remove('inactive');
            pag_last.classList.remove('inactive');
        }
    }

    pag_next.addEventListener('click', (e) => {
        if(!e.currentTarget.classList.contains('inactive')) {
            drawCards(pages, ++currentPage);
        }        
    });

    pag_prev.addEventListener('click', (e) => {
        if(!e.currentTarget.classList.contains('inactive')) {
            drawCards(pages, --currentPage);
        }
    });

    pag_last.addEventListener('click', (e) => {
        if(!e.currentTarget.classList.contains('inactive')) {
            currentPage = pages.length - 1;
            drawCards(pages, currentPage);
        }
    });

    pag_first.addEventListener('click', (e) => {
        if(!e.currentTarget.classList.contains('inactive')) {
            currentPage = 0;
            drawCards(pages, currentPage);
        }
    });    

    //Модальное окно
    const modal_img = document.getElementById('modal_img');
    const modal_head = document.getElementById('modal_head');
    const modal_subhead = document.getElementById('modal_subhead');
    const modal_desc = document.getElementById('modal_desc');
    const modal_age = document.getElementById('modal_age');
    const modal_inoculations = document.getElementById('modal_inoculations');
    const modal_diseases = document.getElementById('modal_diseases');
    const modal_parasites = document.getElementById('modal_parasites');

    const modal_opener = (index) => {
        console.log(pages[currentPage][index])
        overlay.classList.add('active');
        modal.classList.add('active');
        body.style.overflow = 'hidden';
        modal_img.src = '.' + pages[currentPage][index].img;
        modal_img.alt = pages[currentPage][index].name;
        modal_head.innerText = pages[currentPage][index].name;
        modal_subhead.innerText = `${pages[currentPage][index].type} - ${pages[currentPage][index].breed}`;
        modal_desc.innerText = pages[currentPage][index].description;
        modal_age.innerText = pages[currentPage][index].age;
        modal_inoculations.innerText = pages[currentPage][index].inoculations.join(', ');
        modal_diseases.innerText = pages[currentPage][index].diseases.join(', ');
        modal_parasites.innerText = pages[currentPage][index].parasites.join(', ');
    };
    
});