"use strict";

class Sticky {
    constructor(doc) {
        this.textArea = doc.createElement("textarea");
        this.textArea.classList.add("note");
        this.textArea.placeholder = "Type your notes here!"
        this.textArea.style.left = `${Math.random() * window.innerWidth}px`
        this.textArea.style.top = `${Math.random() * window.innerHeight}px`
        regsisterDrag(this.textArea);
        doc.body.appendChild(this.textArea);
    }
}

//let notes = document.getElementsByClassName("note");
//for (let n of notes) regsisterDrag(n);

let createdNotes = new Array();
createdNotes.push(new Sticky(document));

document.addEventListener("dblclick", ev => {
    createdNotes.push(new Sticky(document));
});

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

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
