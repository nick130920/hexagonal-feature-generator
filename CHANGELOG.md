# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-03-12

### Added in 1.1.0

- **Nueva característica**: Ahora la API se proporciona mediante una **URL en lugar de un archivo local**, permitiendo obtener automáticamente la documentación de Swagger o GraphQL.
- **Nueva característica**: La última API utilizada se guarda automáticamente y se muestra en un input para facilitar modificaciones.
- **Nueva característica**: Se agregó la opción de generar la **estructura feature-based** para proyectos Angular, organizando los archivos por módulos de negocio.
- **Nueva característica**: Se agregó soporte para **guardar y reutilizar** la última API utilizada en futuras ejecuciones.

### Changed in 1.1.0

- **Mejora**: Se optimizó la interacción con el usuario mostrando la última API usada y permitiendo modificarla directamente en el input de VS Code.
- **Mejora**: Se mejoró la organización de las carpetas generadas, permitiendo una estructura más modular basada en features en lugar de directorios genéricos.
- **Mejora**: Se optimizó el tiempo de procesamiento al obtener datos desde Swagger o GraphQL vía URL.

### Fixed in 1.1.0

- **Corrección**: Se solucionó un error que impedía la selección del tipo de API en algunos entornos.
- **Corrección**: Se corrigió un problema en la generación de modelos TypeScript cuando los nombres de las entidades contenían caracteres especiales.
- **Corrección**: Se solucionó un bug que impedía la correcta generación de los archivos en proyectos con rutas complejas.

### Deprecated in 1.1.0

- **Obsoleto**: La generación de archivos en carpetas genéricas (`services/`, `components/`, `models/`) ha sido marcada como obsoleta y se recomienda la nueva **arquitectura feature-based**.

### Removed in 1.1.0

- **Eliminado**: Se eliminó la funcionalidad de carga de archivos Swagger/GraphQL en favor de la nueva implementación basada en URL.

### Security in 1.1.0

- **Seguridad**: Se actualizaron dependencias críticas para eliminar vulnerabilidades conocidas en `graphql` y `swagger-parser`.

## [1.0.7] - 2024-03-10

### Added in 1.0.7

- **Nueva característica**: Se agregó soporte para generar controladores REST con integración de Swagger (OpenAPI).
- **Nueva característica**: Se incluyó una función para pluralizar nombres en inglés, utilizada en la generación de nombres de endpoints y mensajes.
- **Nueva característica**: Se agregó la capacidad de generar schemas de GraphQL para su uso con herramientas como GraphQL Codegen.

### Changed in 1.0.7

- **Mejora**: Se optimizó el proceso de generación de la estructura hexagonal para reducir el tiempo de ejecución.
- **Mejora**: Se mejoró la documentación interna del código generado, incluyendo comentarios Javadoc en los controladores y servicios.
- **Mejora**: Se actualizaron las plantillas para incluir validaciones básicas en los métodos de los servicios.

### Fixed in 1.0.7

- **Corrección**: Se solucionó un error que causaba que la extensión no generara correctamente los archivos en proyectos con nombres de paquetes complejos.
- **Corrección**: Se corrigió un problema en la función de pluralización que no manejaba correctamente palabras que terminan en `ss` (por ejemplo, `class` → `classes`).
- **Corrección**: Se arregló un bug que impedía la generación de archivos en sistemas operativos con rutas sensibles a mayúsculas y minúsculas.

### Deprecated in 1.0.7

- **Obsoleto**: La función de generación de controladores sin Swagger ha sido marcada como obsoleta y se eliminará en la próxima versión mayor.

### Removed in 1.0.7

- **Eliminado**: Se eliminó la dependencia obsoleta `old-library` que ya no era necesaria.

### Security in 1.0.7

- **Seguridad**: Se actualizaron las dependencias de desarrollo para corregir vulnerabilidades conocidas.

---

## [1.0.6] - 2024-03-06

### Added in 1.0.6

- **Nueva característica**: Se agregó soporte inicial para la generación de DTOs (Data Transfer Objects).
- **Nueva característica**: Se incluyó una plantilla básica para la generación de excepciones personalizadas.

### Fixed in 1.0.6

- **Corrección**: Se solucionó un error que causaba que la extensión no funcionara correctamente en proyectos sin una estructura de paquetes definida.

---

## [1.0.5] - 2024-03-05

### Added in 1.0.5

- **Nueva característica**: Se agregó soporte para la generación de repositorios JPA.
- **Nueva característica**: Se incluyó una plantilla para la generación de servicios de aplicación.

### Changed in 1.0.5

- **Mejora**: Se mejoró la organización de las plantillas en la carpeta `templates`.

---

## [1.0.4] - 2024-03-05

### Fixed in 1.0.4

- **Corrección**: Se corrigió un error que impedía la generación de archivos en proyectos con espacios en las rutas.

---

## [1.0.3] - 2024-03-05

### Added in 1.0.3

- **Nueva característica**: Se agregó soporte para la generación de interfaces de puertos de entrada y salida.

---

## [1.0.2] - 2024-03-05

### Fixed in 1.0.2

- **Corrección**: Se solucionó un problema que causaba que la extensión no se activara correctamente en algunos proyectos.

---

## [1.0.1] - 2024-03-05

### Added in 1.0.1

- **Nueva característica**: Se agregó soporte inicial para la generación de la estructura hexagonal básica.

---

## [1.0.0] - 2024-03-01

### Added in 1.0.0

- **Lanzamiento inicial**: Primera versión estable de la extensión con soporte para la generación de la estructura hexagonal básica.
