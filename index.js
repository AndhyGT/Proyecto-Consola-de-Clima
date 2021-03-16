require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {

            case 1:
                // mostrar mensaje
                const terminoBusqueda = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(terminoBusqueda);

                // Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);
                if (idSeleccionado === '0') continue;

                const lugarSel = lugares.find(l => l.id === idSeleccionado);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Mostrar Resultado
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre);
                console.log('Lat:', lugarSel.lat);
                console.log('Long:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc);

                break;
            case 2:
                busquedas.historialCapitalizacion.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0)


}

main();