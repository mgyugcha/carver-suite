import { resolve as resolvePath } from "path";
import { app } from "electron";
import { Database, verbose } from "sqlite3";

const sqlGenerador = `\
CREATE TABLE IF NOT EXISTS recover (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  titulo TEXT NOT NULL, 
  -- datos de ingreso
  propietario TEXT, 
  fechaDeIngreso DATE DEFAULT (
    datetime('now', 'localtime')
  ), 
  horaDeIngreso DATE DEFAULT (
    datetime('now', 'localtime')
  ), 
  diagnosticoExpress TEXT, 
  requerimientosDelUsuario TEXT, 
  -- datos de entrega
  especialista TEXT, 
  fechaDeEntrega DATE DEFAULT (
    datetime('now', 'localtime')
  ), 
  horaDeEntrega DATE DEFAULT (
    datetime('now', 'localtime')
  ), 
  novedadesFinales TEXT, 
  observacionesFinales TEXT, 
  -- recuperación de datos
  stdout TEXT, 
  carver TEXT, 
  outputFolderRecover TEXT, 
  pid TEXT, 
  code TEXT, 
  -- clasificar archivos
  outputFolderSorter TEXT, 
  percent REAL DEFAULT 0, 
  statistics TEXT
)
`;

const sqlite3 = verbose();
let db: Database;

const cargarTabla = () =>
  new Promise<void>((resolve, reject) => {
    console.info("creando tabla");
    db.run(sqlGenerador, (err) => {
      if (err) {
        console.error("Ocurrió error");
        return reject(err);
      }
      resolve();
    });
  });

export const getDatabase = async (): Promise<Database> => {
  if (db) return db;
  // cargar base de datos
  const dbPath = resolvePath(app.getPath("userData"), "database.db");
  console.info("cargando base de datos en:", dbPath);
  db = new sqlite3.Database(dbPath);
  // cargando tabla
  await cargarTabla();
  return db!;
};

export default db!;
