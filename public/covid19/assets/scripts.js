$(() => {
    const mostrarGrafico = (casosCovid) => {
        const sobre10000 = casosCovid.filter((item) => item.deaths >= 100000)

        let columnas = [];
        sobre10000.forEach(elemento => {
            columnas.push({ y: elemento.confirmed, label: elemento.location }, { y: elemento.deaths, label: elemento.location });
            console.log(columnas)
        });

        var chart = new CanvasJS.Chart("graficoCovidTotal", {
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

    const covidMundial = () => {
        const urlBase = 'http://localhost:3000/api/total';

        fetch(urlBase)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                //LLAMAMOS A MÉTODOS PARA CARGAR DATOS EN GRÁFICO Y TABLA
                mostrarGrafico(data.data);
                mostrarTabla(data.data);
            })
    }
    covidMundial();
})

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
            ],
        },
        ]
    });
    chart.render();
}