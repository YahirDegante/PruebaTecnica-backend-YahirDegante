# API GraphQL - Gestión de Usuarios y Libros

Este proyecto es una API GraphQL desarrollada con Node.js, Apollo Server y MongoDB que permite gestionar usuarios y sus libros asociados.

## Estructura del Proyecto

```
PruebaTecnica-backend-YahirDegante/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de conexión a MongoDB
│   ├── models/
│   │   ├── User.js              # Modelo y esquema de Usuario
│   │   └── Book.js              # Modelo y esquema de Libro
│   ├── schemas/
│   │   └── typeDefs.js          # Definiciones de tipos GraphQL
│   ├── resolvers/
│   │   └── resolvers.js         # Resolvers para queries y mutations
│   └── server.js                # Punto de entrada de la aplicación
├── .env                         # Variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── package.json                 # Dependencias y scripts
└── README.md                    # Este archivo
```

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js con Apollo Server (GraphQL)
- **Base de datos**: MongoDB con Mongoose ODM
- **Variables de entorno**: dotenv

## 📋 Requisitos Previos

- Node.js 16 o superior
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## Configuración

### 1. Clonar e instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/library-app
PORT=4000
```

### 3. Ejecutar la aplicación
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

La API estará disponible en: `http://localhost:4000/graphql`

## Ejemplos de Uso - GraphQL

### **Queries**

#### 1. Obtener todos los usuarios con sus libros
```graphql
query GetAllUsers {
  users {
    userId
    name
    email
    books {
      bookId
      title
      author
    }
  }
}
```

#### 2. Obtener un usuario específico
```graphql
query GetUser {
  user(userId: 1234) {
    userId
    name
    email
    books {
      bookId
      title
    }
  }
}
```

#### 3. Obtener libros de un usuario
```graphql
query GetUserBooks {
  userBooks(userId: 1234) {
    bookId
    title
    author
    user {
      name
      email
    }
  }
}
```

#### 4. Obtener todos los libros
```graphql
query GetAllBooks {
  books {
    bookId
    title
    author
    user {
      userId
      name
    }
  }
}
```

### **Mutations**

#### 1. Crear usuario
```graphql
mutation CreateUser {
  createUser(input: {
    name: "Yahir Degante",
    email: "yahir@gmail.com"
  }) {
    userId
    name
    email
    createdAt
  }
}
```

#### 2. Actualizar usuario
```graphql
mutation UpdateUser {
  updateUser(
    userId: 1234,
    input: {
      name: "Yahir Salinas",
      email: "yahir@gmail.com"
    }
  ) {
    userId
    name
    email
    updatedAt
  }
}
```

#### 3. Eliminar usuario
```graphql
mutation DeleteUser {
  deleteUser(userId: 1234)
}
```

#### 4. Crear libro para usuario
```graphql
mutation CreateBook {
  createBook(
    userId: 1234,
    input: {
      title: "Cien años de soledad",
      author: "Gabriel García Márquez"
    }
  ) {
    bookId
    title
    author
    user {
      name
    }
  }
}
```

#### 5. Actualizar libro
```graphql
mutation UpdateBook {
  updateBook(
    bookId: 5678,
    input: {
      title: "Cien años de soledad - Edición Especial"
    }
  ) {
    bookId
    title
    author
  }
}
```

#### 6. Eliminar libro
```graphql
mutation DeleteBook {
  deleteBook(bookId: 5678)
}
```

## Flujo Completo de Ejemplo

### 1. Primero crea un usuario:
```graphql
mutation {
  createUser(input: {
    name: "Yahir Degante",
    email: "yahir@gmail.com"
  }) {
    userId  # Guarda este ID para los siguientes pasos
    name
  }
}
```

### 2. Luego crea libros para ese usuario:
```graphql
mutation {
  createBook(
    userId: 1234,  # Usa el userId obtenido anteriormente
    input: {
      title: "El Principito",
      author: "Antoine de Saint Exupery"
    }
  ) {
    bookId
    title
  }
}
```

### 3. Finalmente consulta los resultados:
```graphql
query {
  user(userId: 1234) {
    name
    email
    books {
      bookId
      title
      author
    }
  }
}
```

## Modelos de Datos

### Usuario
```javascript
{
  userId: 1234,           // ID nuumerico 4 digitos
  name: "Juan Pérez",     // Nombre completo
  email: "juan@email.com", // Email unico
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

### Libro
```javascript
{
  bookId: 5678,                          // ID nuumerico 4 digitos
  title: "El Quijote",                   // Título del libro
  author: "Miguel de Cervantes",         // Autor del libro
  userId: 1234,                          // ID del usuario propietario
  createdAt: "2024-01-15T10:35:00.000Z",
  updatedAt: "2024-01-15T10:35:00.000Z"
}
```

## Scripts Disponibles

```bash
npm start          # Inicia el servidor en producción
npm run dev        # Inicia el servidor en desarrollo (con nodemon)
```

## 🔍 Solución de Problemas

### Error de conexión con MongoDB
- Verificar que MongoDB esté ejecutándose
- Confirmar la URI en el archivo `.env`
- Asegurar que el puerto 27017 esté disponible

### Error de puerto en uso
- Cambiar el puerto en el archivo `.env`
- Verificar que no haya otra instancia del servidor ejecutándose

### Error de datos duplicados
- El email debe ser único entre usuarios
- Un usuario no puede tener libros con mismo título y autor

## Notas Adicionales

- Los IDs numéricos (`userId`, `bookId`) se generan automáticamente en el rango 1000-9999
- Las fechas se manejan en formato ISO automáticamente
- Las validaciones son case-insensitive y manejan acentos
- Al eliminar un usuario, se eliminan automáticamente todos sus libros
