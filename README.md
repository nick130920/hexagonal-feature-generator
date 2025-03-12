# Hexagonal Feature Generator

**Hexagonal Feature Generator** es una extensión para Visual Studio Code que permite generar automáticamente una estructura basada en la arquitectura hexagonal a partir de una entidad en un proyecto Java con Spring Boot. Esta versión ha sido completamente refactorizada para mejorar su mantenibilidad y escalabilidad, separando la lógica en módulos independientes (FileGenerator, EntityParser y TemplateProcessor) y ofreciendo una interfaz interactiva que permite seleccionar exactamente qué componentes generar.

---

## 🚀 Características

- **Generación modular y escalable:**  
  La extensión está dividida en módulos independientes, lo que facilita la extensión y el mantenimiento del código.
- **Generación automática de estructura hexagonal:**  
  A partir de una entidad Java, se crean automáticamente componentes siguiendo la arquitectura hexagonal.
- **Soporte para GraphQL y REST API:**  
  Permite al usuario elegir el tipo de API a generar, con controladores específicos para cada uno.
- **Selección interactiva de componentes:**  
  Mediante un Quick Pick multi-select, el usuario decide qué capas (DTOs, Mappers, Use Case, Controller, etc.) desea generar.
- **Configuración personalizada:**  
  Se puede habilitar o deshabilitar Swagger para controladores REST, establecer el tipo de API por defecto y ajustar otras opciones desde la configuración de VS Code.
- **Entidad de ejemplo:**  
  Si no hay una entidad abierta, la extensión ofrece crear una entidad de ejemplo para facilitar la generación inicial.
- **Limpieza automática del package:**  
  Se detectan y eliminan partes redundantes del package (por ejemplo, `.domain.model`) para adaptarse a distintas estructuras de proyectos.

---

## 🛠 Instalación

1. Descarga la extensión desde el [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).
2. Instala la extensión en VS Code.
3. Reinicia VS Code si es necesario.
4. ¡Listo! Ahora puedes generar estructuras hexagonales de manera rápida y personalizada.

---

## 📌 Requisitos

- **Visual Studio Code** `1.75.0` o superior.
- Proyecto Java con estructura **Maven** o **Gradle**.
- Se recomienda el uso de **Spring Boot** con **Lombok**, **JPA**, **MapStruct** y **Swagger** para una mejor compatibilidad.
- La entidad debe estar ubicada en un paquete que siga la convención `domain.model` (la extensión limpiará esta parte si es necesario).
- Para generar un controlador REST con Swagger, asegúrate de tener la dependencia `springdoc-openapi-starter-webmvc-ui` en tu proyecto.

Si usas Maven, agrega en tu `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>{{version}}</version>
    </dependency>
</dependencies>
```

Si usas Gradle, agrega en tu `build.gradle`:

```gradle
dependencies {
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:{{version}}'
}
```

---

## 📖 Uso

1. **Abre un archivo de entidad Java** en el editor de VS Code.
2. **Ejecuta el comando** `Generate Hexagonal Structure` desde:
   - El menú contextual del explorador de archivos (clic derecho sobre la entidad).
   - La paleta de comandos de VS Code (`Ctrl + Shift + P` o `Cmd + Shift + P` en macOS).
3. **Selecciona el tipo de API** que deseas generar:
   - **GraphQL** o **REST API**.
4. **Elige las capas a generar:**  
   Aparecerá una lista interactiva (Quick Pick multi-select) para que selecciones los componentes que deseas generar (DTOs, Mapper, Use Case, Controller, etc.).
5. **Genera la estructura:**  
   La extensión creará los archivos en la ubicación correcta dentro del proyecto según la configuración y las opciones elegidas.
6. **Si no hay una entidad activa,** se preguntará si deseas generar una entidad de ejemplo en `src/main/java/com/example/domain/model/Example.java` para luego proceder con la generación.

---

## 📂 Estructura Generada

Dependiendo de la selección, se creará una estructura similar a la siguiente:

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
│   │   │   │   ├── {Entidad}RestController.java  (con o sin Swagger)
```

---

## 🛠 Contribuciones

Si encuentras algún problema o tienes sugerencias para mejorar la extensión, abre un [issue en GitHub](https://github.com/nick130920/hexagonal-feature-generator/issues) o envía un pull request.

---

## 📜 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.
