"use strict";

class Sticky {
    constructor() {
        this.styleLeft = `${Math.random() * window.innerWidth}px`
        this.styleTop = `${Math.random() * window.innerHeight}px`
    }
}

 function addStickyToDocument(s, doc) {
        let textArea = doc.createElement("textarea");
        textArea.classList.add("note");
        textArea.placeholder = "Type your notes here!"
        textArea.style.left = s.styleLeft;
        textArea.style.top = s.styleTop;
        regsisterDrag(textArea);
        doc.body.appendChild(textArea)
}

let createdNotes, item;
// get created notes from storage
if ((item = localStorage.getItem("createdNotes")) !== null) { 
    console.log(item);
    createdNotes = JSON.parse(item);
    for (let n of createdNotes) {
        addStickyToDocument(n, document);
    }
} else { // if this is the first time, then create a new list
    createdNotes = new Array();
    localStorage.setItem("createdNotes", JSON.stringify(createdNotes));
    console.error("could not parse localStorage.createdNotes");
}
    createdNotes.push(new Sticky(document));

// create new sticky note on double click
document.addEventListener("dblclick", ev => {
    let s = new Sticky;
    addStickyToDocument(s, document); 
    createdNotes.push(s); 
    localStorage.setItem("createdNotes", JSON.stringify(createdNotes)); // save to storage
});

//https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging

function regsisterDrag(elem) {
    elem.addEventListener("pointerdown", ev => elem.setPointerCapture(ev.pointerId));
    elem.addEventListener("pointerup", ev => elem.releasePointerCapture(ev.pointerId));
    elem.addEventListener("pointermove", ev => {
        // if the pointer is on this element, drag it 
        if (elem.hasPointerCapture(ev.pointerId)) {
            elem.style.left = `${elem.offsetLeft + ev.movementX}px`
            elem.style.top = `${elem.offsetTop + ev.movementY}px`
        }
    })
}
