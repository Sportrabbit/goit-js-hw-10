'use strict'

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const inputElem = document.querySelector('#datetime-picker');
const buttonElem = document.querySelector('[data-start]');
const daysElem = document.querySelector('[data-days]');
const hoursElem = document.querySelector('[data-hours]');
const minutesElem = document.querySelector('[data-minutes]');
const secondsElem = document.querySelector('[data-seconds]');

let timer = {
    intervalid: null,
    isActive: false,
    differenceInTime: 0,
    userSelectedDate: null,

    convertMs(ms) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const days = Math.floor(ms / day);
        const hours = Math.floor((ms % day) / hour);
        const minutes = Math.floor(((ms % day) % hour) / minute);
        const seconds = Math.floor((((ms % day) % hour) % minute) / second);
        return { days, hours, minutes, seconds };
    },

    start() {
        if (!this.userSelectedDate || this.isActive) {
            return;
        }
        const startTime = this.userSelectedDate;
        const currentTime = Date.now();
        this.differenceInTime = startTime - currentTime;

        if (this.differenceInTime <= 0) {
            this.differenceInTime = 0;
            this.stop();
            return;
        }

        this.isActive = true;
        this.intervalid = setInterval(() => {
            const currentTime = Date.now();
            this.differenceInTime = startTime - currentTime;
            if (this.differenceInTime <= 0) {
                this.stop();
            } else {
                const timeInTimer = this.convertMs(this.differenceInTime);
                daysElem.textContent = this.padTime(timeInTimer.days);
                hoursElem.textContent = this.padTime(timeInTimer.hours);
                minutesElem.textContent = this.padTime(timeInTimer.minutes);
                secondsElem.textContent = this.padTime(timeInTimer.seconds);
            }
        }, 1000);
    },

    stop() {
        clearInterval(this.intervalId);
        this.isActive = false;
    },

    reset() {
        clearInterval(this.intervalid);
        this.isActive = false;
        daysElem.textContent = '00';
        hoursElem.textContent = '00';
        minutesElem.textContent = '00';
        secondsElem.textContent = '00';
    },

    padTime(value) {
        return String(value).padStart(2, '0');
    },
};

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onclose: selectedDates => {
        const selectedDate = selectedDates[0];
        if (!timer.isActive) {
            timer.userSelectedDate = selectedDate;
            if (selectedDate < Date.now()) {
                iziToast.show({
                    iconUrl: imgIcon,
                    message: 'Please choose a date in the future',
                    color: red,
                    position: "topRight",
                });
                buttonElem.classList.add('active-button');
                buttonElem.disabled = true;
            } else {
                buttonElem.classList.remove('active-button');
                buttonElem.classList.add('inactive-button');
                buttonElem.disabled = false;
            }
        } else {
            timer.reset();
            timer.userSelectedDate = selectedDate;
            timer.start;
        }
    },
};

buttonElem.addEventListener('click', () => {
    if (!timer.isActive && timer.userSelectedDate >= Date.now()) {
        timer.start;
        buttonElem.classList.add('active-button');
        buttonElem.classList.remove('inactive-button');
    }
});

try {
    flatpickr(inputElem, options);
} catch (error) {
    const errorMessage =
      'An error occurred while initializing the date picker. Please try again later.';
    console.error(errorMessage, error);
    iziToast.error({
      title: 'Error',
      message: errorMessage,
      position: 'topRight',
    });
}