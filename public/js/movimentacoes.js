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
    var printersInfo=[]
    // Table
    const table=document.createElement('table')
    const thead=document.createElement('thead')
    table.appendChild(thead)
    const tbody=document.createElement('tbody')
    table.appendChild(tbody)
    page.appendChild(table)
    // Requisição
    const request=document.getElementById('request')
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
                },500)
            },3000)
        }
    }()
    const fade=document.createElement('div')
    fade.oncontextmenu=(e)=>{
        e.preventDefault()
    }
    fade.onclick=(e)=>{
        if(e.path[0]==fade&&e.clientX<(fade.clientWidth-25)){
            document.body.removeChild(fade)
            fade.innerHTML=''
        }
    }
    fade.className='fade'
    const retornoEstoque=function(){
        // Form
        let form=document.createElement('form')
        form.id='gerarSaida'
        // Input: Motivo
        let motivos=document.createElement('select')
        // Button: Enviar
        let enviar=document.createElement('button')
        enviar.type='submit'
        enviar.textContent='Enviar'
        // Button: Fechar
        let fechar=document.createElement('button')
        fechar.textContent='Fechar'
        fechar.onclick=(e)=>{
            e.preventDefault()
            document.body.removeChild(fade)
            fade.innerHTML=''
        }
        // Append
        form.append(motivos)
        form.append(enviar)
        form.append(fechar)
        // Events
        form.onsubmit=(e)=>{
            e.preventDefault()
            document.body.removeChild(fade)
            socket.emit('retornoEstoque',selections,motivos.value)
            selections=[]
        }
        return {
            form: form,
            motivos: motivos
        }
    }()
    const confirmacaoSaida=function(){
        let div,span,label,subspan
        // Form
        const form=document.createElement('form')
        form.className='confirmacao'
         /* Equip.Instalado
        ------------------*/
        span=document.createElement('span')
        span.className='title'
        span.textContent='Equip.Instalação'
        form.appendChild(span)
        div=document.createElement('div')
        div.className='table'
        form.appendChild(div)
        /* Rows
        --------*/
        // Serial
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Serial'
        Serial=document.createElement('span')
        span.appendChild(label)
        span.appendChild(Serial)
        div.appendChild(span)
        // Modelo
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Modelo'
        Modelo=document.createElement('span')
        span.appendChild(label)
        span.appendChild(Modelo)
        div.appendChild(span)
        // Tipo
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Tipo'
        Tipo=document.createElement('span')
        span.appendChild(label)
        span.appendChild(Tipo)
        div.appendChild(span)
        // ContPB
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='ContPB'
        ContPB=document.createElement('span')
        span.appendChild(label)
        span.appendChild(ContPB)
        div.appendChild(span)
        // ContColor
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='ContColor'
        ContColor=document.createElement('span')
        span.appendChild(label)
        span.appendChild(ContColor)
        div.appendChild(span)
        // Tipo Saída
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Tipo Saída'
        tipoSaida=document.createElement('span')
        span.appendChild(label)
        span.appendChild(tipoSaida)
        div.appendChild(span)
        // Requisitante
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Requisitante'
        requisitante=document.createElement('span')
        span.appendChild(label)
        span.appendChild(requisitante)
        div.appendChild(span)
        // Tipo de Movimentação
        tipoMov=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        subspan=document.createElement('span')
        label.textContent='Tipo de Movimentação'
        subspan.append(tipoMov)
        span.append(label)
        span.append(subspan)
        div.appendChild(span)
        // Data Modificação
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Data Modificação'
        dataModificacao=document.createElement('span')
        span.appendChild(label)
        span.appendChild(dataModificacao)
        div.appendChild(span)
        /* Equip.Retirado
        ------------------*/
        span=document.createElement('span')
        span.className='title'
        span.textContent='Equip.Retirado'
        form.appendChild(span)
        div=document.createElement('div')
        div.className='table'
        form.appendChild(div)
        // Inputs
        // OS
        let numOS=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='OS'
        span.append(label)
        span.append(numOS)
        div.appendChild(span)
        //
        let cliente=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Cliente'
        span.append(label)
        span.append(cliente)
        div.appendChild(span)
        //
        let equipRetirado=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Equip. Retirado'
        span.append(label)
        span.append(equipRetirado)
        div.appendChild(span)
        //
        let modeloRetirado=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Modelo Retirado'
        span.append(label)
        span.append(modeloRetirado)
        div.appendChild(span)
        //
        let contPBRetirado=document.createElement('input')
        contPBRetirado.type='number'
        contPBRetirado.min='0'
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Cont.P&B Ret'
        span.append(label)
        span.append(contPBRetirado)
        div.appendChild(span)
        //
        let contColorRetirado=document.createElement('input')
        contColorRetirado.type='number'
        contColorRetirado.min='0'
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Cont.Color Ret'
        span.append(label)
        span.append(contColorRetirado)
        div.appendChild(span)
        //
        let localizacao=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Localização'
        span.append(label)
        span.append(localizacao)
        div.appendChild(span)
        //
        let pendLeitura=document.createElement('input')
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Fez Leitura ?'
        span.append(label)
        span.append(pendLeitura)
        div.appendChild(span)
        //
        let dataAtendimento=document.createElement('input')
        dataAtendimento.type='datetime-local'
        span=document.createElement('span')
        label=document.createElement('label')
        label.textContent='Data Atendimento'
        span.append(label)
        span.append(dataAtendimento)
        div.appendChild(span)
        // Button: Enviar
        let enviar=document.createElement('button')
        enviar.type='submit'
        enviar.textContent='Enviar'
        // Button: Fechar
        let fechar=document.createElement('button')
        fechar.textContent='Fechar'
        // Button: Salvar
        let salvar=document.createElement('button')
        salvar.textContent='Salvar'
        // Append: Buttons
        let buttons=document.createElement('div')
        buttons.append(enviar)
        buttons.append(fechar)
        buttons.append(salvar)
        form.appendChild(buttons)
        // Events
        enviar.onclick=(e)=>{
            e.preventDefault()
            document.body.removeChild(fade)
            let datetime=dataAtendimento.value.replace('T',' ')
            fade.innerHTML=''
            socket.emit('confirmarSaida',{
                serial:Serial.textContent,
                tipoMovimentacao:tipoMov.value,
                CodSolicitacao:numOS.value,
                cliente:cliente.value,
                serialRetirado:equipRetirado.value,
                modeloRetirado:modeloRetirado.value,
                PBRetirado:contPBRetirado.value,
                ColorRetirado:contColorRetirado.value,
                localizacao:localizacao.value,
                pendenciaLeitura:pendLeitura.value,
                dataAtendimento:datetime,
            })
        }
        fechar.onclick=(e)=>{
            e.preventDefault()
            document.body.removeChild(fade)
            fade.innerHTML=''
        }
        salvar.onclick=(e)=>{
            e.preventDefault()
            document.body.removeChild(fade)
            fade.innerHTML=''
            let datetime=dataAtendimento.value.replace('T',' ')
            socket.emit('salvar',{
                serial:Serial.textContent,
                tipoMov:tipoMov.value,
                CodSolicitacao:numOS.value,
                cliente:cliente.value,
                serialRetirado:equipRetirado.value,
                modeloRetirado:modeloRetirado.value,
                PBRetirado:contPBRetirado.value,
                ColorRetirado:contColorRetirado.value,
                localizacao:localizacao.value,
                pendenciaLeitura:pendLeitura.value,
                dataAtendimento:datetime,
            })
        }
        form.onsubmit=(e)=>{
            e.preventDefault()
        }
        // Serial,Modelo,Tipo,ContPB,ContColor,tipoSaida,requisitante,dataModificacao
        return{
            form:form,
            Serial:Serial,
            Modelo:Modelo,
            Tipo:Tipo,
            ContPB:ContPB,
            ContColor:ContColor,
            tipoSaida:tipoSaida,
            requisitante:requisitante,
            dataModificacao:dataModificacao,
            tipoMov:tipoMov,
            numOS:numOS,
            cliente:cliente,
            equipRetirado:equipRetirado,
            modeloRetirado:modeloRetirado,
            contPBRetirado:contPBRetirado,
            contColorRetirado:contColorRetirado,
            localizacao:localizacao,
            pendLeitura:pendLeitura,
            dataAtendimento:dataAtendimento,
            salvar:salvar,
        }
    }()
    socket.on('confirmarSaida',serial=>{
        tbody.removeChild(document.getElementById(serial))
        printersInfo.splice(printersInfo.findIndex(v=>v.Serial==serial),1)
    })
    socket.on('salvar',printer=>{
        var row=printersInfo.find(v=>v.Serial==printer.serial)
        let tableRow=document.getElementById(printer.serial)
        if(printer.fonte!='SISTEMA')tableRow.className='savedfromUser'
        row.serial=printer.serial
        row.tipoMovimentacao=printer.tipoMov
        row.CodSolicitacao=printer.numOS
        row.Cliente=printer.cliente
        row.serialRetirado=printer.equipRetirado
        row.modeloRetirado=printer.modeloRetirado
        row.PBRetirado=printer.contPBRetirado
        row.ColorRetirado=printer.contColorRetirado
        row.localizacao=printer.localizacao
        row.PendenciaLeitura=printer.pendLeitura
        row.DataAtendimento=printer.dataAtendimento
    })
    socket.on('warning',warning)
    request.onclick=()=>{
        fade.appendChild(retornoEstoque.form)
        document.body.prepend(fade)
        request.style.display='none'
    }
    /* Methods
    -----------*/
    function tableAdd(printer){
        let tr=document.createElement('tr')
        let row=printersInfo.find(v=>v.Serial==printer.Serial)
        tr.id=printer.Serial
        if(row.Fonte=='SISTEMA'){
            tr.className='confirmed'
        }else if(row.Fonte!=null){
            tr.className='savedfromUser'
        }else{
            tr.style.cursor='pointer'
            tr.onclick=({currentTarget})=>{
                tr=currentTarget
                let id=tr.cells[0].innerText
                if(tr.clicked==false){
                    tr.clicked=true
                    selections.push(id)
                    for(let i=0;i<tr.cells.length;i++){
                        tr.cells[i].style.backgroundColor='rgb(47,47,47)'
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
        }
        tr.onmousedown=(e)=>{
            if(e.button==2){
                // Equipamento Instalação
                confirmacaoSaida.Serial.textContent=tr.id
                confirmacaoSaida.Modelo.textContent=tr.cells[1].textContent
                confirmacaoSaida.Tipo.textContent=tr.cells[2].textContent
                confirmacaoSaida.ContPB.textContent=tr.cells[3].textContent
                confirmacaoSaida.ContColor.textContent=tr.cells[4].textContent
                confirmacaoSaida.tipoSaida.textContent=tr.cells[5].textContent
                confirmacaoSaida.requisitante.textContent=tr.cells[6].textContent
                confirmacaoSaida.dataModificacao.textContent=tr.cells[7].textContent
                // Equipamento Retirado
                var info=printersInfo.find(v=>v.Serial==tr.id)
                if(info.Fonte=='SISTEMA'){
                    confirmacaoSaida.tipoMov.disabled=true
                    confirmacaoSaida.numOS.disabled=true
                    confirmacaoSaida.cliente.disabled=true
                    confirmacaoSaida.equipRetirado.disabled=true
                    confirmacaoSaida.modeloRetirado.disabled=true
                    confirmacaoSaida.localizacao.disabled=true
                    confirmacaoSaida.dataAtendimento.disabled=true
                }else{
                    confirmacaoSaida.tipoMov.disabled=false
                    confirmacaoSaida.numOS.disabled=false
                    confirmacaoSaida.cliente.disabled=false
                    confirmacaoSaida.equipRetirado.disabled=false
                    confirmacaoSaida.modeloRetirado.disabled=false
                    confirmacaoSaida.localizacao.disabled=false
                    confirmacaoSaida.dataAtendimento.disabled=false
                }
                confirmacaoSaida.tipoMov.value=info.tipoMovimentacao
                confirmacaoSaida.numOS.value=info.CodSolicitacao
                confirmacaoSaida.cliente.value=info.Cliente
                confirmacaoSaida.equipRetirado.value=info.serialRetirado
                confirmacaoSaida.modeloRetirado.value=info.modeloRetirado
                confirmacaoSaida.contPBRetirado.value=info.PBRetirado
                confirmacaoSaida.contColorRetirado.value=info.ColorRetirado
                confirmacaoSaida.localizacao.value=info.localizacao
                confirmacaoSaida.pendLeitura.value=info.PendenciaLeitura
                let dataAtendimento=info.DataAtendimento
                if(dataAtendimento){
                    dataAtendimento=dataAtendimento.replace(' ','T')
                    dataAtendimento=dataAtendimento.replace('Z','')
                }
                confirmacaoSaida.dataAtendimento.value=dataAtendimento
                //
                fade.appendChild(confirmacaoSaida.form)
                document.body.prepend(fade)
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
                tr.cells[i].style.backgroundColor='rgb(47,47,47)'
            }
        }else{
            tr.clicked=false
        }
        return tr
    }
    /* Start
    ---------*/
    page.appendChild(table)
    socket.on('movimentacoes',(result,motivos)=>{
        printersInfo=result
        retornoEstoque.motivos.innerHTML=''
        motivos.forEach(element=>{
            const option=document.createElement('option')
            option.textContent=element
            option.value=element
            retornoEstoque.motivos.appendChild(option)
        })
        result.forEach(element=>{
            element.DataModificacao=new Date(element.DataModificacao).toLocaleString()
        })
        selections=[]
        thead.innerHTML=tbody.innerHTML=''
        let tr,th // Elements
        tr=document.createElement('tr')
        thead.appendChild(tr)
        let keys=Object.keys(result[0])
        let columns=keys.slice(2,10)
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
                tbody.append(tableAdd(info))
            })
        }
        textCount.innerText=tbody.childElementCount
    })
    socket.on('saidaEstoque',printer=>{
        printer.CodSolicitacao=null
        printer.Cliente=null
        printer.localizacao=null
        printer.serialRetirado=null
        printer.PBRetirado=null
        printer.ColorRetirado=null
        printer.modeloRetirado=null
        printer.tipoMovimentacao=null
        printer.PendenciaLeitura=null
        printer.DataAtendimento=null
        printer.Fonte=null
        printersInfo.push(printer)
        tbody.prepend(tableAdd({
            Serial:printer.Serial,
            Modelo:printer.Modelo,
            Tipo:printer.Tipo,
            ContadorPB:printer.ContadorPB,
            ContadorColor:printer.ContadorColor,
            tipoSaida:printer.tipoSaida,
            Requisitante:printer.Requisitante,
            DataModificacao:printer.DataModificacao,
        }))
        textCount.innerText=tbody.childElementCount
    })
    socket.on('retornoEstoque',printer=>{
        tbody.removeChild(document.getElementById(printer.Serial))
        textCount.innerText=tbody.childElementCount
    })
    socket.on('confirmed',printer=>{
        let tableRow=document.getElementById(printer.serial)
        if(tableRow)tableRow.className='confirmed'
        var row=printersInfo.find(v=>v.Serial==printer.serial)
        row.CodSolicitacao=printer.os
        row.ContadorPB=printer.contPB
        row.ContadorColor=printer.contColor
        row.Cliente=printer.cliente
        row.localizacao=printer.localizacao
        row.serialRetirado=printer.equipRetirado
        row.modeloRetirado=printer.modeloRetirado
        row.PBRetirado=printer.PBRetirado
        row.ColorRetirado=printer.ColorRetirado
        row.tipoMovimentacao=printer.tipoMov
        row.PendenciaLeitura=printer.pendLeitura
        row.DataAtendimento=printer.dataAtendimento
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