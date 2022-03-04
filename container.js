const { promises: fs } = require("fs");

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
        const existProd = ProductsArray.find(prod => prod.name === pProduct.name);
        if (existProd) throw new Error(`YA EXISTE EL PRODUCTO. INGRESAR UNO NUEVO. DETENIENDO EJECUCION`);
        else {
            const newId = ProductsArray.length === 0 ? 1 : ProductsArray[ProductsArray.length - 1].id + 1;
            ProductsArray.push({ ...pProduct, id: newId });
            await fs.writeFile(this.filePath, JSON.stringify(ProductsArray, null, 2));
            return newId;
        }
    };
    getById = async (pId) => {
        const ProductsArray = await this.getAll();
        const product = ProductsArray.find(prod => prod.id === pId);
        return product ? product : null;
    };
    deleteById = async (pId) => {
        const ProductsArray = await this.getAll();
        if (ProductsArray.length !== 0) {
            const filteredProducts = ProductsArray.filter(prod => prod.id !== pId);
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

module.exports = new Container("productos.txt");