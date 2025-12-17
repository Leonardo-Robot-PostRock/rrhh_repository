# Form Validator — Demo (ES)

Este repositorio contiene un pequeño validador de formularios en Vanilla JS pensado como demo para un cliente de RRHH (Workana).

## Características

- Validación por atributos `data-validate`.
- Reglas: `required`, `email`, `phone`, `min`, `max`, `pattern`, `date`, `numeric`, `minValue`, `maxValue`.
- Mensajes localizables (`es`, `en`).
- Demo con estilos Tailwind para aspecto corporativo.

## Uso

1. Instalar dependencias (solo `esbuild` como dev):

```bash
npm install
```

2. Construir el bundle:

```bash
npm run build
```

3. Abrir `examples/index.html` en un navegador (sirve con `file://` ya que usa CDN para Tailwind).

## Campos añadidos para RRHH

- `salary`: campo numérico con validación `numeric|minValue:30000|maxValue:200000`.
- `currency`: selector obligatorio (`USD`, `EUR`, `ARS`).
- `schedule`: selector obligatorio con horarios predefinidos.

## Desarrollo y documentación

- Código modular en `src/` con JSDoc en funciones principales.
- Ejecuta `npm run build` para regenerar `dist/bundle.js`.

---

If you need further translations or adjustments, run the build and edit the example layout in `examples/index.html`.
