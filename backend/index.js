import express from 'express';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

import { db } from './db.js';

// Endpoint de ejemplo: obtener productos desde la base de datos
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos'); // Cambia "productos" por el nombre de tu tabla
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar la base de datos', details: error.message });
  }
});

// Aquí puedes agregar más rutas para tu API

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
