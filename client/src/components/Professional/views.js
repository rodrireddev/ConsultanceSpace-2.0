import { lazy } from "react";

// Vistas del dashboard del profesional (se cargan bajo demanda).
export const views = {
  welcome: lazy(() => import("./SubComponents/Welcome")),
  misPacientes: lazy(() => import("./SubComponents/MyPatients/MyPatients")),
  pacientes: lazy(() => import("./SubComponents/Patients/Patients")),
  citas: lazy(() => import("./SubComponents/Appointment/Appointment")),
  inventario: lazy(() => import("./SubComponents/Stock/Stock")),
  profesionales: lazy(() => import("./SubComponents/professionals/Professionals")),
  horarios: lazy(() => import("./SubComponents/SetHorarios/SetHorarios")),
  ingresos: lazy(() => import("./SubComponents/Managment")),
  suscripcion: lazy(() => import("./SubComponents/Subscripcion/Subscripcion")),
  configuracion: lazy(() => import("./SubComponents/ConfiguracionDePagos/Configuracion")),
  // Vistas a las que se llega desde otras pantallas (sin botón en el menú)
  agendarCita: lazy(() => import("./SubComponents/Appointment/NuevaCita/NuevaCita")),
  tratamientos: lazy(() => import("./SubComponents/Treatments/Treatments")),
  historiaClinica: lazy(() => import("./SubComponents/HistoriaClinica/HistoriaClinica")),
  finalizarCita: lazy(() => import("./SubComponents/Appointment/FinalCita/FinalCita")),
  mailing: lazy(() => import("../SendMail/mail")),
};

// Botones del menú lateral, en orden.
export const menu = [
  { key: "misPacientes", label: "Mis Pacientes" },
  { key: "pacientes", label: "Pacientes" },
  { key: "citas", label: "Citas agendadas" },
  { key: "inventario", label: "Inventario" },
  { key: "profesionales", label: "Profesionales" },
  { key: "horarios", label: "Set Horarios" },
  { key: "ingresos", label: "Ingresos" },
  { key: "suscripcion", label: "Subscripcion" },
  { key: "configuracion", label: "Configuracion" },
];
