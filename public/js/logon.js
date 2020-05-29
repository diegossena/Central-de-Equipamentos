/* Global
----------*/
var alert;
var button;
/* Main
--------*/
window.onload = function() {
    alert = document.body.getElementsByClassName("alert")[0];
    button = document.logon.lastElementChild;
    document.logon.addEventListener('submit',function(e){e.preventDefault()})
    document.logon.onsubmit = function(){submit()};
}
function submit(){
    // Button
    button.firstChild.style.opacity="0";
    button.firstChild.classList.add("loading");
    button.firstChild.innerText = "";
    // Alert
    document.logon.lastElementChild.disabled = true;
    alert.style.opacity = "0";
    setTimeout(function(){alert.classList.add("alert");},500);
    // Load
    let user = {
        username: document.logon.elements[0].value,
        password: document.logon.elements[1].value
    }
    let xhr = new XMLHttpRequest();
    xhr.open("post","/auth",true);
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify(user));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if(response){
                window.location="/central";
            }else{
                warning()
            }
        }else if(xhr.status == 401) {
            warning()
        }
    }
    function warning(){
        alert.classList.add("warning");
        alert.innerText = "Usuário ou senha inválida";
        alert.style.opacity = "1";
        button.firstChild.innerText="Entrar";
        button.firstChild.classList.remove("loading");
        setTimeout(function(){
            button.firstChild.style.opacity="1";
            button.disabled=false;
        },100);
    }
}