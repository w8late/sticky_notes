"use strict";

let notes = document.getElementsByClassName("note");
Array.from(notes).forEach(regsisterDrag);

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging/74219113#74219113

function regsisterDrag(elem) {
    elem.addEventListener("pointerdown", ev => elem.setPointerCapture(ev.pointerId));
    elem.addEventListener("pointerup", ev => elem.releasePointerCapture(ev.pointerId));
    elem.addEventListener("pointermove", ev => { 
        if (elem.hasPointerCapture(ev.pointerId)) {
            elem.style.left = `${elem.offsetLeft + ev.movementX}px`
            elem.style.top = `${elem.offsetTop + ev.movementY}px`
        }
    })
}
