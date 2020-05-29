const socket=io()

window.onload=()=>{
    /* Definições
    --------------*/
    var selections=[]
    var indexes=[]
    const page=document.getElementById('page')
    const selectbox=document.getElementById('filters').children[0]
    const textbox=document.getElementById('filters').children[1]
    const textCount=document.getElementById('filters').children[2].children[1]
    // Table
    const table=document.createElement('table')
    const thead=document.createElement('thead')
    table.appendChild(thead)
    const tbody=document.createElement('tbody')
    table.appendChild(tbody)
    page.appendChild(table)
    // Requisição
    const request=document.getElementById('request')
    const fade=document.getElementsByClassName('fade')[0]
    fade.style.display='none'
    const gerarSaida=document.getElementById('gerarSaida')
    gerarSaida.children[3].addEventListener("click",()=>{
        fade.style.display='none'
    })
    gerarSaida.children[4].addEventListener("click",(e)=>{
        e.preventDefault()
        fade.style.display='none'
    })
    request.onclick=()=>{
        while(gerarSaida.children[5]){
            gerarSaida.removeChild(gerarSaida.children[5])
        }
        selections.forEach(element => {
            let input=document.createElement('input')
            input.type='hidden'
            input.name='serials[]'
            input.value=element
            gerarSaida.appendChild(input)
        })
        fade.style.display='block'
        request.style.display='none'
    }
    /* Methods
    -----------*/
    function tableAdd(printer){
        let tr=document.createElement('tr')
        tr.id=printer.Serial
        tr.style.cursor='pointer'
        tr.onclick=({currentTarget})=>{
            tr=currentTarget
            let id=tr.cells[0].innerText
            if(tr.clicked==false){
                tr.clicked=true
                selections.push(id)
                for(let i=0;i<tr.cells.length;i++){
                    tr.cells[i].style.backgroundColor='rgb(47, 47, 47)'
                }
                if(selections.length!=0){
                    request.lastElementChild.innerText=selections.length
                    request.style.display='block'
                }
            }else{
                tr.clicked=false
                let key=selections.findIndex(result=>result==id)
                selections.splice(key,1)
                for(let i=0;i<tr.cells.length;i++){
                    tr.cells[i].style.backgroundColor=''
                }
                request.lastElementChild.innerText=selections.length
                if(selections.length==0){
                    request.style.display='none'
                }
            }
        }
        let td
        for(const key in printer){
            td=document.createElement('td')
            tr.appendChild(td)
            td.textContent=printer[key]
        }
        if(selections.find(result=>result==tr.cells[0].innerText)){
            tr.clicked=true
            for(let i=0;i<tr.cells.length;i++){
                tr.cells[i].style.backgroundColor='rgb(47, 47, 47)'
            }
        }else{
            tr.clicked=false
        }
        return tr
    }
    /* Start
    ---------*/
    socket.on('estoque',result=>{
        selections=[]
        thead.innerHTML=''
        tbody.innerHTML=''
        let tr,th,td // Elements
        tr=document.createElement('tr')
        thead.appendChild(tr)
        Object.keys(result[0]).forEach(keys=>{
            th=document.createElement('th')
            tr.appendChild(th)
            indexes.push(keys)
            th.textContent=keys
        })
        if(result[0][Object.keys(result[0])[0]]){
            result.forEach(printer => {
                tbody.append(tableAdd(printer))
            })
        }
        textCount.innerText=tbody.childElementCount
    })
    socket.on('entradaEstoque',printer=>{
        tbody.prepend(tableAdd(printer))
        textCount.innerText=tbody.childElementCount
    })
    socket.on('saidaEstoque',printer=>{
        selections.splice(selections.findIndex(v=>v==printer.Serial),1)
        tbody.removeChild(document.getElementById(printer.Serial))
        textCount.innerText=tbody.childElementCount
    })
    socket.on('retornoEstoque',printer=>{
        tbody.prepend(tableAdd({
            Serial:printer.Serial,
            Modelo:printer.Modelo,
            Tipo:printer.Tipo,
            ContadorPB:printer.ContadorPB,
            ContadorColor:printer.ContadorColor,
        }))
        textCount.innerText=tbody.childElementCount
    })
    /* Filtros
    -----------*/
    selectbox.oninput=textbox.oninput=()=>{
        let count=0
        const index=indexes.findIndex(value=>value==selectbox.value)
        let searchText=textbox.value.toUpperCase()
        for(let i=0;i<tbody.childElementCount;i++){
            const element=tbody.children[i]
            if(element.cells[index].textContent.search(searchText)>=0){
                element.style.display=''
                count++
            }else{
                element.style.display='none'
            }
        }
        textCount.innerText=count
    }
}