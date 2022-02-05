'use strict';
window.addEventListener('DOMContentLoaded', () => {
	//tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');


	function hideTabContent() {
		tabContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
		tabs.forEach(tab => {
			tab.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabContent[i].classList.add('show', 'fade');
		tabContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');

	}

	hideTabContent();
	showTabContent();
	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((tab, i) => {
				if (tab == target) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// Timer
	const deadLine = '2022-02-21';

	function getTimeRemaining(endTime) {
		const time = Date.parse(endTime) - Date.parse(new Date()),
			days = Math.floor(time / (1000 * 60 * 60 * 24)),
			hours = Math.floor(time / (1000 * 60 * 60) % 24),
			minutes = Math.floor(time / (1000 * 60) % 60),
			seconds = Math.floor(time / (1000) % 60);

		return {
			'total': time,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endTime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(apdateClock, 1000);

		apdateClock();

		function apdateClock() {
			const t = getTimeRemaining(endTime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
				days.innerHTML = '';
				hours.innerHTML = '';
				minutes.innerHTML = '';
				seconds.innerHTML = '';
			}
		}

	}

	setClock('.timer', deadLine);

	//modal window

	const openModalBtn = document.querySelectorAll('[data-modal]'),
		//closeModalBtn = document.querySelector('[data-close]'),
		modal = document.querySelector('.modal');

	function openModal() {
		//modal.classList.toggle('show');
		modal.classList.add('show');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	openModalBtn.forEach(item => {
		item.addEventListener('click', openModal);
	});



	function closeModal() {
		modal.classList.toggle('show');
		document.body.style.overflow = '';
	}

	//closeModalBtn.addEventListener('click', closeModal);

	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') { //закрытие модалки при клике на подложку или на крестик
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});


	const modalTimerId = setTimeout(openModal, 50000);

	function showmodalByScrol() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			openModal();
			window.removeEventListener('scroll', showmodalByScrol);
		}

	}

	window.addEventListener('scroll', showmodalByScrol);

	//Используем классы для карточек

	class CardMenu {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUah();
		}
		changeToUah() {
			this.price = this.price * this.transfer;
		}
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => {
					element.classList.add(className);
				});
			}

			element.innerHTML = `				
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.title}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
					</div>				
				`;
			this.parent.append(element);

		}
	}

	const getData = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status:  ${res.status}`);
		}
		return await res.json();
	};

	getData('http://localhost:3000/menu').
	then((data) => {
		data.forEach(({
			img,
			altimg,
			title,
			descr,
			price
		}) => {
			new CardMenu(img, altimg, title, descr, price, '.menu .container').render();
		});
	});



	// Forms

	const forms = document.querySelectorAll('form');

	const massage = {
		loading: 'img/form/spinner.svg',
		secces: 'Спасибо. Мы скоро с вами свяжимся',
		failure: 'Что-то пошло не так'
	};

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			body: data,
			headers: {
				'content-type': 'application/json'
			}
		});
		return await res.json();
	};



	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMassage = document.createElement('img');
			statusMassage.src = massage.loading;
			statusMassage.style.cssText = 'display:block; margin: 0 auto';

			form.insertAdjacentElement('afterend', statusMassage);

			const formData = new FormData(form);

			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(massage.secces);
					//statusMassage.remove();
				})
				.catch(() => {
					showThanksModal(massage.failure);
				})
				.finally(() => {
					form.reset();
					statusMassage.remove();
				});
		});
	}

	forms.forEach((form) => {
		bindPostData(form);
	});

	function showThanksModal(message) { //отображение модалки статуса отправки формы
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');

		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
		<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
		</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			//prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}


	// Slider	

	const slides = document.querySelectorAll('.offer__slide'),
		slider = document.querySelector('.offer__slider'),
		next = document.querySelector('.offer__slider-next'),
		prev = document.querySelector('.offer__slider-prev'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current'),
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		sliderInner = document.querySelector('.offer__slider-inner'),
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1,
		offset = 0;

	if (slides.length < 10) {
		total.innerHTML = `0${slides.length}`;
		current.innerHTML = `0${slideIndex}`;
	} else {
		total.innerHTML = slides.length;
		current.innerHTML = `${slideIndex}`;
	}

	sliderInner.style.width = 100 * slides.length + '%';
	sliderInner.style.display = 'flex';
	sliderInner.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach((item) => {
		item.style.width = width;
	});

	slider.style.position = 'relative';
	const indicators = document.createElement('ol'),
		dots = [];
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 15;
			display: flex;
			justify-content: center;
			margin-right: 15%;
			margin-left: 15%;
			list-style: none;
	`;

	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
				box-sizing: content-box;
				flex: 0 1 auto;
				width: 30px;
				height: 6px;
				margin-right: 3px;
				margin-left: 3px;
				cursor: pointer;
				background-color: #fff;
				background-clip: padding-box;
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				opacity: .5;
				transition: opacity .6s ease;
		`;
		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}


	next.addEventListener('click', () => {
		if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += +width.slice(0, width.length - 2);
		}
		console.log(+width.slice(0, width.length - 2));
		sliderInner.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}
		dotsOpacity();
	});

	prev.addEventListener('click', () => {		
		if (offset == 0) {
			offset = +width.slice(0, width.length - 2) * (slides.length - 1);
		} else {
			offset -= +width.slice(0, width.length - 2);
		}
		sliderInner.style.transform = `translateX(-${offset}px)`;
		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}
		dotsOpacity();
		});

	dots.forEach((dot) => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');
			slideIndex = slideTo;
			offset = +width.slice(0, width.length - 2) * (slideTo - 1);
			sliderInner.style.transform = `translateX(-${offset}px)`;
			dotsOpacity();
		}); 
		
	});

	function dotsOpacity() {
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
		dots.forEach((dot) => {
			dot.style.opacity = '.5';
		});
		dots[slideIndex-1].style.opacity = '1';
	}
});