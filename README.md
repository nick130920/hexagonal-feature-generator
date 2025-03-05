# Hexagonal Feature Generator

**Hexagonal Feature Generator** es una extensión para Visual Studio Code que permite generar automáticamente una estructura basada en la arquitectura hexagonal a partir de una entidad en un proyecto Java con Spring Boot.

## 🚀 Características

- 🔹 **Generación automática de estructura hexagonal** basada en una entidad Java.
- 🔹 **Soporte para GraphQL y REST API**, permitiendo al usuario elegir el tipo de controlador.
- 🔹 **Verificación de entidad existente** y opción para crear una entidad de ejemplo si no hay ninguna disponible.
- 🔹 **Generación de los siguientes componentes**:
  - DTOs (Request y Response)
  - Mappers
  - Servicios
  - Excepciones personalizadas
  - Puertos de entrada y salida
  - Repositorios y adaptadores de persistencia
  - Controladores GraphQL o REST (según elección del usuario)
- 🔹 **Integración con el menú contextual del explorador de archivos** para facilitar la generación de la estructura.

## 🛠 Instalación

1. Descarga la extensión desde el [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).
2. Instala la extensión en VS Code.
3. ¡Listo! Ya puedes generar estructuras hexagonales fácilmente.

## 📌 Requisitos

- VS Code 1.75.0 o superior.
- Proyecto Java con estructura **Maven** o **Gradle**.
- Se recomienda el uso de **Spring Boot** con **Lombok**, **JPA** y **MapStruct** para una mejor compatibilidad.
- La entidad debe estar en el paquete `domain.model` del proyecto para evitar problemas de ubicación de paquetes.

## 📖 Uso

1. **Abre un archivo de entidad Java** en el editor de VS Code.
2. **Ejecuta el comando** `Generate Hexagonal Structure` desde:
   - El menú contextual del explorador de archivos (clic derecho en la entidad).
   - La barra de comandos de VS Code (`Ctrl + Shift + P` o `Cmd + Shift + P` en macOS).
3. **Selecciona el tipo de API** que deseas generar:
   - **GraphQL** o **REST API**.
4. **La estructura se generará automáticamente** en la ubicación correcta dentro del proyecto.

### 🆕 ¿No tienes una entidad?

Si no tienes una entidad abierta, la extensión te preguntará si deseas generar una **entidad de ejemplo** con una estructura básica en `src/main/java/com/example/domain/model/Example.java`.
Luego puedes generar la estructura hexagonal con la entidad de ejemplo.

---

## 📂 Estructura Generada

Dependiendo de la opción seleccionada, la extensión creará la siguiente estructura:

```text
src/main/java/com/example/
├── application/
│   ├── dto/
│   │   ├── request/
│   │   │   ├── {Entidad}Request.java
│   │   ├── response/
│   │   │   ├── {Entidad}Response.java
│   ├── mapper/
│   │   ├── {Entidad}Mapper.java
│   ├── service/
│   │   ├── {Entidad}Service.java
│   ├── exception/
│   │   ├── {Entidad}NotFoundException.java
│   ├── port/
│   │   ├── input/
│   │   │   ├── {Entidad}UseCase.java
│   │   ├── output/
│   │   │   ├── {Entidad}RepositoryPort.java
│
├── infrastructure/
│   ├── adapter/
│   │   ├── output/
│   │   │   ├── persistence/
│   │   │   │   ├── {Entidad}Repository.java
│   │   │   │   ├── jparepository/
│   │   │   │   │   ├── SpringData{Entidad}Repository.java
│   │   ├── input/
│   │   │   ├── graphql/controller/  (si se elige GraphQL)
│   │   │   │   ├── {Entidad}GraphQlController.java
│   │   │   ├── controller/  (si se elige REST)
│   │   │   │   ├── {Entidad}RestController.java
```

---

## 🔧 Configuración Avanzada

Esta extensión permite personalizar la generación de la estructura hexagonal:

### 🔹 Elección del tipo de API

Puedes establecer el tipo de API por defecto desde la configuración de VS Code:

1. Abre **Configuración** (`Ctrl + ,` o `Cmd + ,` en macOS).
2. Busca `hexagonalFeatureGenerator.apiType`.
3. Selecciona `"graphql"` o `"rest"` según el tipo de API que prefieras generar por defecto.

También puedes cambiar la opción en cada generación mediante el menú interactivo.

### 🔹 Limpieza dinámica del package name

La extensión detecta automáticamente la ubicación de la entidad y limpia paquetes innecesarios como `.domain.model`, asegurando que la generación sea flexible para diferentes estructuras de proyectos.

---

## 🛠 Contribuciones

Si encuentras algún problema o tienes sugerencias para mejorar la extensión, abre un [issue en GitHub](https://github.com/nick130920/hexagonal-feature-generator/issues).

---

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.
