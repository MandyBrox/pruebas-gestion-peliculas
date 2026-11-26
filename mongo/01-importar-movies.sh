
#!/bin/bash

# Detener la ejecución si se produce algún error.
set -e

# Importar las películas en la base de datos movies.
mongoimport \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --db movies \
  --collection movies \
  --jsonArray \
  --file /docker-entrypoint-initdb.d/movies.json
