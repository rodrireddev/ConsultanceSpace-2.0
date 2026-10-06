
# ![logo](client/src/components/Header/CONSULTANCESPACETIPO.png)



## Introducción

Consultance Space es una plataforma en desarrollo de gestión médica y acercamiento entre profesionales y pacientes.

## Objetivos

Crear una plataforma 100% responsive dónde los profesionales de la salud puedan:

 * Registrar a sus pacientes. 

 * Agendar y cancelar citas. 

 * Llevar registro y editar su ficha médica asociada

 * Cobrar y ver dinámica su flujo de fondos

 * Llevar registro del stock de su clínica

 * Contactarse con otros profesionales


 Y dónde los pacientes tengan la libertad de:

 * Buscar profesionales por especialidad y reservar citas con ellos en los horarios adecuados

 * Pagar de forma virtual sus consultas

 * Cancelar citas

 * Acceder en todo momento a su historial médico

## Developer Team

 * @RodrigoToledo5
 
 * @jescabvaz

 * @MarlonLondono

 * @JorgeDGutierrez

 * @Hasuro1797 

 * @ftbalboa 

## Stack de Tecnologías

### Front End:

HTML, CSS, Javascript, React, Material-ui, Redux

### Back End:

Node js, Javascript, Express, Sequelize

### Database:

PostgreSQL

## Puesta en marcha

Requisitos: Node 20+ y PostgreSQL.

### API (`/api`)

```bash
cd api
cp .env.example .env   # completar DATABASE_URL, FIREBASE_PROJECT_ID, GMAIL, MP_*
npm install
npm run dev            # http://localhost:3005
npm test               # los tests de rutas no necesitan DB; los de models sí
```

Sin `DATABASE_URL` y `FIREBASE_PROJECT_ID` la API no arranca y dice qué falta; sin `GMAIL_*` o `MP_*` arranca igual pero avisa qué funcionalidad queda deshabilitada. **Nunca se versionan credenciales**: solo los `.env.example`.

### Cliente (`/client`)

```bash
cd client
cp .env.example .env   # completar REACT_APP_FIREBASE_* y REACT_APP_API_URL
npm install --legacy-peer-deps
npm start              # http://localhost:3000
```

### Seguridad

- La API valida en cada request el **ID token de Firebase** (`Authorization: Bearer <token>`); `FIREBASE_PROJECT_ID` debe ser el mismo proyecto que usa el cliente. Cada usuario solo accede a sus datos (citas, historia clínica de sus pacientes, stock, etc.).
- Las suscripciones se acreditan solo después de que el servidor **consulta el pago a Mercado Pago** (`/addSub` con el `payment_id`, y el webhook `/mp/webhook`). Para que el webhook funcione, `API_URL` debe ser una URL pública de la API.

La redirect URI de OAuth de Mercado Pago debe coincidir con `MP_REDIRECT_URI` (API) y con `<origen del cliente>/payments`.

## Imágenes del proyecto

### Home
![img1](/client/src/assets/img/readme/1.PNG)

### Login
![img2](/client/src/assets/img/readme/2.PNG)

### Responsive Admin Dashboard

![gif](/client/src/assets/img/readme/responsive.gif)

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FRodrigoToledo5%2FConsultanceSpace&count_bg=%2333988E&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=views&edge_flat=false)](https://hits.seeyoufarm.com)
