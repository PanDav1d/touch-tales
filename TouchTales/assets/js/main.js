all_data = preload_data();

var link_btn = document.getElementById("open-link");
var continue_btn = document.getElementById("continue");
continue_btn.style.opacity = 0;
var standardBackgroundColor = "#202020"; 

img_1 = document.getElementById("img-1");
img_1.style.opacity = 1;
img_2 = document.getElementById("img-2");
img_2.style.opacity = 0;
activeOne = true;

let currPhrase = 0;
var list = document.getElementById("phrases-content");

var introductionDone = false;



function preload_data(){
    fetch("../assets/content/phrases.json").then((res) => {
        return res.json();
    }).then((data) => {
        all_data = data;
        continue_btn.style.opacity = 1;
    })
}

function addToList(text){
    var node = document.createElement("li");
    node.setAttribute("data-aos", "fade-up");
    node.setAttribute("data-aos-easing", "ease-out-cubic");
    node.setAttribute("data-aos-duration","2500");

    //parsing the text into html
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong> $1 </strong>');
    text = text.replace(/\=\=(.*?)\=\=/g, '<mark>$1</mark>');

    var textNode = document.createElement("div");
    textNode.innerHTML = text;

    node.appendChild(textNode);
    list.appendChild(node);
}

function removeFromList(){
    if(list.childElementCount >= 1){
        list.children[0].remove();
    }
}

function loadNextPhrase(){
    removeFromList();

    addToList(all_data[currPhrase]["text"]);
    loadBG(all_data[currPhrase]["bg-color"]);
    loadImage();
    loadLink();

    currPhrase += 1;

    if(all_data[currPhrase - 1]["time"] != null){
        hideContinueButton(all_data[currPhrase - 1]["time"]);
    }else{
        hideContinueButton(2000);
    }
}

function loadLink(){
    link = all_data[currPhrase]["link"];
    if(link == null){
        link_btn.style.opacity = 0;
        link_btn.style.pointerEvents = 'none';
        return;
    }else{
        link_btn.style.opacity = 1;
        link_btn.style.pointerEvents = 'auto';
    }
    link_btn.setAttribute("href",link);
}

function loadBG(color){
    html = document.getElementsByTagName("html")[0];
    if ( color != null){
        html.style.backgroundColor = color;
    }else{
        html.style.backgroundColor = standardBackgroundColor; 
    }
}

function loadImage(){
    path = all_data[currPhrase]["image"];
    try {
        next_path = all_data[currPhrase + 1]["image"];
    } catch (error) {
        next_path = "";
    }

    if(activeOne){
        if(path != null){
            img_1.style.opacity = 1;
            img_1.setAttribute("src",path);
        }else{
            img_1.style.opacity = 0;
        }

        img_2.style.opacity = 0;
        img_2.setAttribute("src",next_path);
        activeOne = false;
    }else{
        img_1.style.opacity = 0;
        img_1.setAttribute("src",next_path)
        if(path != null){
            img_2.style.opacity = 1;
            img_2.setAttribute("src",path);
        }else{
            img_2.style.opacity = 0;
        }
        activeOne = true;
    }
}

function hideContinueButton(duration){
    continue_btn.style.opacity = 0;
    continue_btn.style.pointerEvents = 'none';

    setTimeout(function(){
        continue_btn.style.opacity = 1;
        continue_btn.style.pointerEvents = 'auto';
    }, duration);
}


var startX;
var startY;
var endX;
var endY;

var swipeArea = document.getElementsByTagName("html")[0];

swipeArea.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

swipeArea.addEventListener('touchend', function (event) {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;
    
    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Wenn die Änderung in der X-Richtung größer ist als die in der Y-Richtung
        if (endX < startX && continue_btn.style.opacity == 1) {
            if(!introductionDone){
                document.getElementById("introduction").style.opacity = 0;
                introductionDone = true;
            }
            loadNextPhrase();
        }
    }
});