document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementsByTagName('body')[0];
    const overlay = document.getElementById('overlay');

    const modal = document.getElementById('modal');
    const modal_close = document.getElementById('modal_close');

    const burger = document.getElementById('burger');
    const menu_container = document.getElementById('menu_container');
    const ankors_menu = [...menu_container.querySelectorAll('a[href^="#"]')];
    let countSlider = 3;

    const window_width = document.documentElement.clientWidth;
    if(window_width >= 1280) {
        countSlider = 3;
    } else if(window_width >= 768 && window_width < 1280) {
        countSlider = 2;
    } else {
        countSlider = 1;
    }
    
    
    const menu_opener = () => {
        burger.classList.add('burger_rotate');
        menu_container.classList.add('open');
        overlay.classList.add('active');
    };

    const menu_closer = () => {
        burger.classList.remove('burger_rotate');
        menu_container.classList.remove('open');
        overlay.classList.remove('active');
    };

    overlay.addEventListener('click', () => {
        menu_closer();
        modal_closer();
    });

    burger.addEventListener('click', (e) => {
        if(e.currentTarget.classList.contains('burger_rotate')) {
            menu_closer();
        } else {
            menu_opener();
        }
    });

    modal_close.addEventListener('click', () => {
        modal_closer();
    });

    ankors_menu.forEach((ankor) => {
        ankor.addEventListener('click', () => {
            menu_closer();
        });
    });

    const lastLinks = [...document.querySelectorAll('nav li:nth-child(1n+3) a')];

    lastLinks.forEach((link) => {
        link.style.pointerEvents = 'none';
    });    

    // слайдер
    const our_slider__content = document.getElementById('our_slider__content');
    if(our_slider__content) {
        const generateSlide = (count, duration = 'left') => {
            const new_cards = [];
            for(let i = 0; i < count; i++) {
                const card = document.createElement('div');
                card.classList.add('our_card');
                const no_data = document.createElement('div');
                no_data.classList.add('no_data');
                no_data.style.display = 'block';
                card.append(no_data);
                new_cards.push(card);
                if(duration === 'left') {
                    our_slider__content.append(card);
                } else {
                    our_slider__content.prepend(card);
                }            
            }

            fetch('https://rolling-scopes-school.github.io/snake911-JSFE2022Q1/shelter/pets.json')
            .then(res => res.json())
            .then(res => {
                new_cards.forEach((new_card) => {
                    const index = new_card.dataset.id = generateId(res.length);
                    const card_img = document.createElement('div');
                    card_img.classList.add('card_img');
                    const img = document.createElement('img');
                    img.src = res[index].img;
                    img.alt = res[index].name;
                    new_card.append(img);

                    const card_name = document.createElement('div');
                    card_name.classList.add('card_name');
                    card_name.innerText = res[index].name;
                    new_card.append(card_name);

                    const button = document.createElement('button');
                    button.classList.add('button_secondary');
                    button.innerText = 'Learn more';
                    new_card.append(button);

                    const no_data = new_card.querySelector('.no_data');
                    no_data.style.display = 'none';
                });
            })
            .catch(error => {
                console.log(error);
            });
        }

        const generateId = (maxId) => {
            const usedCards = [...document.querySelectorAll('.our_card[data-id]')];
            const usedIds = usedCards.map(usedCard => usedCard.dataset.id);
            let id = Math.floor(Math.random() * maxId);
            while(usedIds.includes(id.toString()) || usedIds.length >= maxId - 1) {
                id = Math.floor(Math.random() * maxId);
            }
            return id;
        }

        generateSlide(countSlider);

        const sliderNext = (slider) => { 
            generateSlide(countSlider);      
            const gap = Number(getComputedStyle(slider).gap.replace(/(\D.)/, ''));
            const right = (270 * countSlider) + (gap * (countSlider - 1));
            slider.style.transition = 'none';
            slider.style.right = `-${right}px`;
            slider.style.left = 'auto';              
            setTimeout(() => {
                slider.style.transition = '';
                slider.style.right = ''; 
                setTimeout(() => {
                    for(let i = 0; i < countSlider; i++) {
                        slider.firstElementChild.remove();
                    }
                    slider.style.left = '';
                }, 500);                       
            }, 30);
        }

        const sliderPrev = (slider) => { 
            generateSlide(countSlider, 'right');      
            const gap = Number(getComputedStyle(slider).gap.replace(/(\D.)/, ''));        
            const left = (270 * countSlider) + (gap * (countSlider - 1));
            slider.style.transition = 'none';
            slider.style.left = `-${left}px`;
            slider.style.right = 'auto';              
            setTimeout(() => {
                slider.style.transition = '';
                slider.style.left = ''; 
                setTimeout(() => {
                    for(let i = 0; i < countSlider; i++) {
                        slider.lastElementChild.remove();
                    }
                    slider.style.right = '';
                }, 500);                       
            }, 30);
        }

        const slider_prev = document.getElementById('slider_prev');
        slider_prev.addEventListener('click', function() {
            sliderPrev(this.parentNode.parentNode.firstElementChild);
        });

        const slider_next = document.getElementById('slider_next');
        slider_next.addEventListener('click', function() {
            sliderNext(this.parentNode.parentNode.firstElementChild);
        });
    }
    //модальное окно
    const modal_img = document.getElementById('modal_img');
    const modal_head = document.getElementById('modal_head');
    const modal_subhead = document.getElementById('modal_subhead');
    const modal_desc = document.getElementById('modal_desc');
    const modal_age = document.getElementById('modal_age');
    const modal_inoculations = document.getElementById('modal_inoculations');
    const modal_diseases = document.getElementById('modal_diseases');
    const modal_parasites = document.getElementById('modal_parasites');
    const pets_cards = document.getElementById('pets_cards');

    const cardClickHandler = (e) => {
        const card = e.target.closest('.our_card');
        if(card) {
            modal_opener(card.dataset.id)
        }
    }

    if(our_slider__content) {
        our_slider__content.addEventListener('click', cardClickHandler);
    }

    const modal_opener = (index) => {
        fetch('https://rolling-scopes-school.github.io/snake911-JSFE2022Q1/shelter/pets.json')
        .then(res => res.json())
        .then(res => {
            overlay.classList.add('active');
            modal.classList.add('active');
            body.style.overflow = 'hidden';
            modal_img.src = res[index].img;
            modal_img.alt = res[index].name;
            modal_head.innerText = res[index].name;
            modal_subhead.innerText = `${res[index].type} - ${res[index].breed}`;
            modal_desc.innerText = res[index].description;
            modal_age.innerText = res[index].age;
            modal_inoculations.innerText = res[index].inoculations.join(', ');
            modal_diseases.innerText = res[index].diseases.join(', ');
            modal_parasites.innerText = res[index].parasites.join(', ');
        })
        .catch(error => {
            console.log(error);
        });
    }

    const modal_closer = () => {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    };
})