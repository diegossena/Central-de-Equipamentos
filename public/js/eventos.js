const socket=io()

window.onload=()=>{
    /* Definições
    --------------*/
    var indexes=[]
    const page=document.getElementById('page')
    // Table
    const table=document.createElement('table')
    const thead=document.createElement('thead')
    table.appendChild(thead)
    const tbody=document.createElement('tbody')
    table.appendChild(tbody)
    page.appendChild(table)
    /* Methods
    -----------*/
    function tableAdd(printer){
        let tr=document.createElement('tr')
        let obj=JSON.parse(printer.Object)
        if(printer.Action=='Saida Estoque'){
            tr.style.cursor='pointer'
            tr.onclick=({currentTarget})=>{
                let id=currentTarget.firstElementChild.innerText
                window.open(window.origin+'/central/pdf?type=ComprovSaidaEstoq&id='+id)
            }
            printer.Object='<table class="saidaEstoque">'
            obj.forEach(element => {
                printer.Object+='<tr>'
                for(const key in element){
                    printer.Object+='<td>'+element[key]+'</td>'
                }
                printer.Object+='</tr>'
            })
        }else if(printer.Action=='Retorno Estoque'){
            let length=obj.serials.length
            printer.Object='<table class="retornoEstoque">'
            printer.Object+='<tr><td>'+obj.serials[0]+'</td><td rowspan="'+length+'">'+obj.motivo+'</td></tr>'
            for(let i=1;i<length;i++){
                printer.Object+='<tr><td>'+obj.serials[i]+'</td></tr>'
            }
        }
        printer.Object+='</table>'
        for(const key in printer){
            let td=document.createElement('td')
            tr.appendChild(td)
            td.innerHTML=printer[key]
        }
        return tr
    }
    /* Start
    ---------*/
    socket.on('eventos',result=>{
        selections=[]
        thead.innerHTML=''
        tbody.innerHTML=''
        let tr,th // Elements
        tr=document.createElement('tr')
        thead.appendChild(tr)
        Object.keys(result[0]).forEach(keys=>{
            th=document.createElement('th')
            tr.appendChild(th)
            indexes.push(keys)
            th.textContent=keys
        })
        if(result[0][Object.keys(result[0])[0]]){
            result.forEach(printer=>{
                printer.DataModificacao=new Date(printer.DataModificacao).toLocaleString()
                tbody.append(tableAdd(printer))
            })
        }
    })
    socket.emit('eventos','')
    const form=document.getElementById('search')
    form.onsubmit=(e)=>{
        e.preventDefault()
        const text=form.children[0].value
        socket.emit('eventos',text)
    }
}