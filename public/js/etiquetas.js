window.onload = function() {
    /* Limite de carecteres OSID
    -----------------------------*/
    var element = document.getElementById('osid')
    element.oninput = ()=> {
        if (element.value.length > 5) {
            element.value = element.value.slice(1,6); 
        }
    }
}