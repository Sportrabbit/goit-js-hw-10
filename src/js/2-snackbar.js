'use strict'

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const formElem = document.querySelector('.form');
const inputElem = formElem.querySelector('input[name="delay"]');

function createPromise(e) {
    e.preventDefault();

    const delay = inputElem.value;
    const promiseStatus = formElem.elements.statu.value;

    const promise = new Promise((resolve, reject) => {
        if (promiseStatus === 'fulfilled') {
            setTimeout(() => resolve(delay), delay);
        } else {
            setTimeout(() => reject(delay), delay);
        }
    });

    promise
    .then(delay => {
        iziToast.success({
            message: `✅ Fulfilled promise in ${delay}ms`,
            position: 'topRight',
        });
    })
    .catch(delay => {
        iziToast.error({
            message: `❌ Rejected promise in ${delay}ms`,
            position: 'topRight',
        });
    });
}

formElem.addEventListener('submit', createPromise);