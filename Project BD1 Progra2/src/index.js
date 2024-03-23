//Este archivo archivo es el que ejecuta el programa

import app from './app'

app.listen(app.get('port'))

console.log('Servidor en línea en el puerto: http://localhost:' + app.get('port'))
