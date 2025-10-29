// Configuración de conexión MySQL
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost', // Cambia según tu entorno
  user: 'root',      // Cambia según tu usuario
  password: '',      // Cambia según tu contraseña
  database: 'topitop', // Cambia según tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
