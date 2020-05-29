const socket=io()

window.onload=()=>{
    /* Definições
    --------------*/
    var indexes=[]
    const page=document.getElementById('page')
    const selectbox=document.getElementById('filters').children[0]
    const textbox=document.getElementById('filters').children[1]
    const textCount=document.getElementById('filters').children[2].children[1]
    var printersInfo=[]
    // Table
    const table=document.createElement('table')
    const thead=document.createElement('thead')
    table.appendChild(thead)
    const tbody=document.createElement('tbody')
    table.appendChild(tbody)
    page.appendChild(table)
    // Requisição
    const warning=function(){
        const div=document.createElement('div')
        div.className='warning'
        const span=document.createElement('span')
        div.appendChild(span)
        div.style.opacity='0'
        return (text)=>{
            span.textContent=text
            document.body.appendChild(div)
            div.style.opacity='1'
            setTimeout(function(){
                div.style.opacity='0'
                setTimeout(function(){
                    document.body.removeChild(div)
                },500);
            },3000);
        }
    }()
    socket.on('confirmarSaida',serial=>{
        tbody.removeChild(document.getElementById(serial))
        printersInfo.splice(printersInfo.findIndex(v=>v.Serial==serial),1)
    })
    socket.on('warning',warning)
    /* Methods
    -----------*/
    function tableAdd(printer){
        let tr=document.createElement('tr')
        let row=printersInfo.find(v=>v.Serial==printer.Serial)
        tr.id=printer.Serial
        for(const key in printer){
            let td=document.createElement('td')
            tr.appendChild(td)
            td.textContent=printer[key]
        }
        return tr
    }
    /* Start
    ---------*/
    page.appendChild(table)
    socket.on('historicos',(result)=>{
        printersInfo=result
        result.forEach(element=>{
            element.DataModificacao=new Date(element.DataModificacao).toLocaleString()
            if(element.DataAtendimento)element.DataAtendimento=new Date(element.DataAtendimento).toLocaleString()
        })
        selections=[]
        thead.innerHTML=tbody.innerHTML=''
        let tr,th // Elements
        tr=document.createElement('tr')
        thead.appendChild(tr)
        let keys=Object.keys(result[0])
        //let columns=keys.slice(2,10)
        let columns=keys
        columns.forEach(keys=>{
            th=document.createElement('th')
            tr.appendChild(th)
            indexes.push(keys)
            th.textContent=keys
        })
        if(result[0][keys[0]]){
            result.forEach(printer=>{
                let info={}
                    columns.forEach(element=>{
                    info[element]=printer[element]
                })
                tbody.append(tableAdd(printer))
            })
        }
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