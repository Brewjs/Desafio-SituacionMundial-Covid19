//Se obtiene el JWT a través del formulario de login entregado
const form = document.querySelector('#frmLogin');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const txtEmail = document.querySelector("#txtEmail").value;
    const txtPassword = document.querySelector("#txtPassword").value;
    const token = await postData(txtEmail, txtPassword);
    const datos = await getDatos();
    mostrarGrafico(datos);
    mostrarTabla(datos);
    //toggleFormAndContainer();
    console.log(token);
})

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
        return token
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}

const getDatos = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/total',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt} `
                }
            })
        const { data } = await response.json();
        return data
    } catch (err) {
        console.error(`Error: ${err} `)
    }
}

const getPais = async (jwt, country) => {
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${country}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
        const { data } = await response.json();
        return data;
    }
    catch (err) {
        console.log(`Error: ${err}`);
    }
}

const mostrarGrafico = (data) => {
    const sobre10000 = data.filter(elemento => {
        return elemento.deaths > 100000;
        //console.log(sobre10000)
    })
    const columnas = [];
    sobre10000.forEach(elemento => {
        columnas.push({ y: elemento.confirmed, label: elemento.location }, { y: elemento.deaths, label: elemento.location }, { y: elemento.recovered, label: elemento.location }, { y: elemento.active, label: elemento.location });
        //return activos;
        console.log(columnas)
    })

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Paises con +100.000 Muertes a causa del COVID-"
        },
        axisY: {
            title: ""
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelOrientation: "vertical",
            indexLabel: "{label} {y}",
            indexLabelPlacement: "outside",
            dataPoints: columnas,
        },
        ]
    });
    chart.render();
}

let mostrarTabla = (data) => {
    let tablaUno = "<thead><tr><th>Locación</th><th>Confirmados</th><th>Muertos</th><th>Recuperados</th><th>Activos</th><th>Detalle</th></tr></thead>";

    for (let i = 0; i < data.length; i++) {
        tablaUno += `
            <tr>
                <td>${data[i].location}</td>
                <td>${data[i].confirmed}</td>
                <td>${data[i].deaths}</td>
                <td>${data[i].recovered}</td>
                <td>${data[i].active}</td>
                <td><button id='btn-toggle-modal${i}' type="button" class="btn btn-primary" data-pais=${data[i].location}> 
                Ver detalle
                </button></td>
            </tr>`
    };
    document.getElementById('tabla').innerHTML = tablaUno;
    
    for (let i = 0; i < data.length; i++) {
        let boton = document.getElementById(`btn-toggle-modal${i}`);

        $(`#btn-toggle-modal${i}`).click(async () => {
            $("#exampleModal").modal('show')

            pais = boton.dataset.pais;

            const token = localStorage.getItem('jwt-token');
            let dataPais = await getPais(token, pais);
            mostrarGraficoDos(dataPais);

        });
    }
}
console.log(mostrarTabla)

const mostrarGraficoDos = (data) => {
    var chart = new CanvasJS.Chart("chart2", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: data.location
        },
        axisY: {
            title: ""
        },
        data: [{
            type: "column",
            indexLabelPlacement: "outside",
            indexLabel: "{y}",
            indexLabelOrientation: "horizontal",
            dataPoints: [
                { y: data.confirmed, label: "Confirmados" },
                { y: data.deaths, label: "Muertos" },
                { y: data.recovered, label: "Recuperados" },
                { y: data.active, label: "Activos" }
            ],
        },
        ]
    });
    chart.render();
}

/* for (let i = 0; data.length; i++) {
    let boton = document.querySelector(`#btn-toggle-modal${i}`);
    let cuadroModal = document.querySelector('#modal')
    boton.addEventListener('click', async () => {
        cuadroModal('show')
        pais = boton.dataset()
        const token = localStorage.getItem('jwt-token');
        let datosPais = await getPais(token, pais);
        mostrarGraficoDos(datosPais); */