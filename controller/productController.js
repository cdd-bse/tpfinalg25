const db = require('../db/db');

// ************* Listar por ID ************* //
const ObtenerTodosLosProductos = (req,res)=>{
    const sql = 'SELECT * FROM productos';
    db.query(sql,(err,results)=>{
        if(err)
            throw err;
        res.json(results);
    });
};

// ************* Listar todo ************* //
const ObtenerProductoPorId = (req,res)=>{
    const {id} = req.params;
    const sql = 'SELECT * FROM productos WHERE id = ? '
    db.query (sql,[id],(err,result)=>{
        if(err)
            throw err;
        res.json(result);
    });
};

// ************* Crear producto ************* //
const CrearProducto = (req, res) => {
    const { titulo, color, precio } = req.body;
    console.log('Request Body:', req.body);
    const sql = 'INSERT INTO productos (titulo, color, precio) VALUES (?, ?, ?)';
    
    db.query(sql, [titulo, color, precio], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).json({
                status: "error",
                message: "Hubo un error al crear el producto.",
                error: err.message
            });
        } else {
            console.log('Resultado del alta de producto:', result); 
            const message = `El producto ha sido creado exitosamente.\n 
                            Producto: ${titulo} 
                            Color: ${color} 
                            Precio: ${precio}`;

            res.status(201).json({
                status: "success",
                message: message
            });
        }
    });
};

// ************* Actualizar producto ************* //
const ActualizarProducto = (req, res) => {
	const {id} = req.params;
    const { titulo, color, precio } = req.body;
	const sql = 'UPDATE productos SET titulo = ?, color = ?, precio = ? WHERE id = ?'
    console.log('Request Body:', req.body);
    
    db.query(sql, [titulo,color,precio,id], (err,result) => 
	{
        if (err) {
            console.error('Error al actualizar en la base de datos:', err);
            res.status(500).json({
                status: "error",
                message: "Hubo un error al actualizar el producto.",
                error: err.message
            });
        } else {
            console.log('Resultado de la actualización:', result); 
            const message = `El producto ha sido actualizado exitosamente.\n 
                            Producto: ${titulo} 
                            Color: ${color} 
                            Precio: ${precio}`;

            res.status(201).json({
                status: "success",
                message: message
            });
        }
    });
};

// ************* Eliminar producto ************* //
const BorrarProducto = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM productos WHERE id=?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar en la base de datos:', err);
            res.status(500).json({
                status: "error",
                message: "Hubo un error al eliminar el producto.",
                error: err.message
            });
        } else {
            console.log('Resultado de la eliminación:', result); 
            if (result.affectedRows > 0) {
                res.status(200).json({
                    status: "success",
                    message: `El producto ha sido eliminado exitosamente.`
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: `No se encontró un producto con el ID ${id}.`
                });
            }
        }
    });
};

module.exports={
    ObtenerTodosLosProductos,
    ObtenerProductoPorId,
    CrearProducto,
    ActualizarProducto,
    BorrarProducto
}
