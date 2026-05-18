# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre el proyecto
Plataforma que conecta clientes con maestros y trabajadores de oficios en Chile (electricistas, gasfíteres, carpinteros, pintores, etc.) — similar a un "Uber de los servicios del hogar". Los clientes buscan por oficio y comuna; los maestros crean perfiles con especialidades, zona y precio referencial por hora.

## Stack tecnológico
- **Frontend Web:** React.js (puerto 3001)
- **App Móvil:** React Native + Expo
- **Backend:** Node.js + Express (puerto 3000)
- **Base de datos:** Firebase / Supabase
- **Autenticación:** Firebase Auth

## Comandos de desarrollo

```bash
# Backend
cd backend && npm install
npm run dev

# Frontend Web
cd frontend-web && npm install
npm start

# App Móvil
cd mobile-app && npm install
npx expo start
```

## Arquitectura

Monorepo con tres paquetes independientes. El backend expone una REST API que consumen tanto el frontend web como la app móvil. La autenticación y la base de datos pasan por Firebase/Supabase — el backend actúa como capa intermedia para lógica de negocio y validaciones.

```
maestros-chile/
├── frontend-web/    # React — pages/, components/, services/
├── mobile-app/      # React Native — screens/, components/, services/
└── backend/         # Express — routes/, controllers/, models/, middleware/
```

La carpeta `services/` en frontend y mobile centraliza las llamadas a la API del backend.

## Convenciones de código
- Variables y funciones en inglés; comentarios en español
- Un componente por archivo
- Precios siempre en pesos chilenos (CLP)
- Las comunas siguen la división administrativa oficial de Chile
- Optimizar para conexiones 3G (imágenes comprimidas, requests mínimos)

## Estado actual del proyecto — Fase 1 MVP
- [ ] Registro y login (clientes y maestros)
- [ ] Búsqueda por oficio y comuna
- [ ] Perfil del maestro (foto, descripción, especialidades, precio/hora)
- [ ] Sistema de contacto cliente ↔ maestro

## Contexto del desarrollador
El usuario es principiante en programación. Explicar decisiones técnicas en español y de forma clara. Pedir confirmación antes de modificar archivos existentes.
