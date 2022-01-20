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
	const deadLine = '2022-01-21';

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
			}
		}

	}

	setClock('.timer', deadLine);

	//modal window

	const openModalBtn = document.querySelectorAll('[data-modal]'),
		closeModalBtn = document.querySelector('[data-close]'),
		modal = document.querySelector('.modal');

	function openModal() {
		modal.classList.toggle('show');
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

	closeModalBtn.addEventListener('click', closeModal);

	modal.addEventListener('click', (event) => {
		if (event.target === modal) {
			closeModal();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});


	const modalTimerId = setTimeout(openModal, 7000);

	function showmodalByScrol() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
			openModal();	
			window.removeEventListener('scroll', showmodalByScrol);
		}
		
	}

	window.addEventListener('scroll', showmodalByScrol);
});