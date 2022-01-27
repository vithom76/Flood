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
		if (event.target === modal || event.target.getAttribute('data-close') =='') { //закрытие модалки при клике на подложку или на крестик
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

	new CardMenu(
		"img/tabs/vegy.jpg",
		"vegy",
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов.Продукт активных и здоровых людей.Это абсолютно новый продукт с оптимальной ценой и	высоким качеством!',
		9,
		'.menu .container'
	).render();

	new CardMenu(
		"img/tabs/elite.jpg",
		"elite",
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но икачественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		20,
		'.menu .container',
		'menu__item'
	).render();

	new CardMenu(
		"img/tabs/post.jpg",
		"post",
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие	продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество	белков за счет тофу и импортных вегетарианских стейков.',
		15,
		'.menu .container',
		'menu__item'
	).render();

	// Forms

	const forms = document.querySelectorAll('form');
	
	const massage = {
		loading: 'img/form/spinner.svg',
		secces: 'Спасибо. Мы скоро с вами свяжимся',
		failure: 'Что-то пошло не так'
	};

	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const statusMassage = document.createElement('img');
			statusMassage.src = massage.loading;
			statusMassage.style.cssText = 'display:block; margin: 0 auto';
			//form.append(statusMassage);
			form.insertAdjacentElement('afterend', statusMassage);
			//showThanksModal(massage.loading);
			
			//const request = new XMLHttpRequest(); старый способ общения с сервером
			//request.open('POST', 'server.php');
			//request.setRequestHeader('content-type', 'multipart/form-data'); при испльзовании form-data заголовок устанавливать не нужно
			//request.setRequestHeader('content-type', 'multipart/form-json'); заголовок JSON формата
			const formData = new FormData(form);
			const obj = { };
			formData.forEach((value, key) => {    // получение объекта и данных формы. У данных формы свой спецефический объект
				obj[key] = value;
			});

		

			//request.send(formData);  //в обычном формате
			//request.send(json);        // в формате json 

			fetch('server.php', {
				method: "POST",
				//body: formData, отправка в простом формате
				body: JSON.stringify(obj),
				headers: {
					'content-type': 'multipart/form-json'
				}
			})
				.then(data => data.text()) 				
				.then(data => {
				console.log(data);
				showThanksModal(massage.secces);
				statusMassage.remove();
			})
				.catch(() => {
					showThanksModal(massage.failure);
				})
				.finally(() => {
					form.reset();
				});

			/* request.addEventListener('load', ()=> {
				if (request.status === 200) {
					//statusMassage.textContent = massage.secces;					
					console.log(request.response);
					showThanksModal(massage.secces);
					form.reset();
					statusMassage.remove();				
				} else {
					showThanksModal(massage.failure);
					statusMassage.remove();
				}
			}); */

		});
	}

	forms.forEach((form) => {
		postData(form);
	});

	function showThanksModal(message) {              //отображение модалки статуса отправки формы
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
	
	fetch('http://localhost:3000/menu')
		.then(data => data.json())
		.then(res => console.log(res));

});