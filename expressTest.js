const express = require("express");
const contenedor = require("./container");//API DE PRODUCTOS

const PORT = process.env.PORT || 8080;
const app = express();

//RUTA PARA MOSTRAR LOS PRODUCTOS TOTALES
app.get("/productos", async (req, res) => {
	const parsedProductos = await contenedor.getAll();
	res.send(`<h1 style="color: blue;">Bienvenidos</h1>
		${parsedProductos.map(prod => JSON.stringify(prod))}`
	);
});

//RUTA PARA MOSTRAR PRODUCTO ALEATORIO
app.get("/productoRandom", async (req, res) => {
	const parsedProductos = await contenedor.getAll();
	let randomNum = Math.floor(Math.random() * 3)
	res.send(`${JSON.stringify(parsedProductos[randomNum])}`);
});

//PONEMOS A ESCUCHAR EL SERVIDOR
 const myserver = app.listen(PORT, () => {
	console.log(`SERVIDOR ACTIVO Y ESCUCHANDO EN PUERTO ${PORT}`);
});

//EN CASO DE ERROR
myserver.on('error', error => console.log(error));