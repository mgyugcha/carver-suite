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
