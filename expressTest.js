const req_express = require("express");
const { promises: fs } = require("fs");

const PORT = process.env.PORT || 8080;

class Container {
	constructor(pFilePath) {
		this.filePath = pFilePath;
	}

	createIfNotExist = async () => {
		let file;
		try {
			file = await fs.readFile(this.filePath, "utf-8");
			return file;
		} catch (error) {
			if (error.code == "ENOENT") {
				await fs.writeFile(this.filePath, "[]");
				file = await fs.readFile(this.filePath, "utf-8");
			} else console.log(error);
		}
		return file;
	};
	save = async (pProduct) => {
		const ProductsArray = await this.getAll();
		const existProd = ProductsArray.find((prod) => prod.name === pProduct.name);
		if (existProd) {
			throw new Error(
				`YA EXISTE EL PRODUCTO. INGRESAR UNO NUEVO. DETENIENDO EJECUCION`
			);
		} else {
			const idsArray = ProductsArray.map((prod) => prod.id);
			const newId = ProductsArray.length === 0 ? 1 : Math.max(...idsArray) + 1;
			ProductsArray.push({ ...pProduct, id: newId });
			await fs.writeFile(this.filePath, JSON.stringify(ProductsArray, null, 2));
			return newId;
		}
	};
	getById = async (pId) => {
		const ProductsArray = await this.getAll();
		const product = ProductsArray.find((prod) => prod.id === pId);
		return product ? product : null;
	};
	deleteById = async (pId) => {
		const ProductsArray = await this.getAll();
		if (ProductsArray.length !== 0) {
			const filteredProducts = ProductsArray.filter((prod) => prod.id !== pId);
			await fs.writeFile(
				this.filePath,
				JSON.stringify(filteredProducts, null, 4)
			);
		}
	};
	getAll = async () => {
		let file = await this.createIfNotExist();
		return JSON.parse(file);
	};
	deleteAll = async () => {
		try {
			await fs.writeFile(this.filePath, "[]");
		} catch (error) {
			throw new Error(
				`NO SE ESCRIBIO EL ARCHIVO CORRECTAMENTE ${error.message}`
			);
		}
	};
}

const contenedor1 = new Container("./productos.txt");

const app = req_express();

const main = async () => {
	const parsedProductos = await contenedor1.getAll();
	
	app.get("/productos", (req, res) => {
		res.send(`<h1 style="color: blue;">Bienvenidos</h1>
			${parsedProductos.map(prod => JSON.stringify(prod))}`);
	});
	
	app.get("/productoRandom", (req, res) => {
		let randomNum = Math.floor(Math.random() * 3)
		res.send(`${JSON.stringify(parsedProductos[randomNum])}`);
	});
	
	app.listen(PORT, () => {
		console.log(`SERVIDOR ACTIVO Y ESCUCHANDO EN PUERTO ${PORT}`);
	});
}

main();