import { lazy } from "react";

// Vistas del dashboard del paciente (se cargan bajo demanda).
export const views = {
  welcome: lazy(() => import("./SubComponents/Welcome")),
  profesionales: lazy(() => import("../Professional/SubComponents/professionals/Professionals")),
  citas: lazy(() => import("./SubComponents/Appointment")),
  atencion: lazy(() => import("./SubComponents/Attention")),
  pagos: lazy(() => import("./SubComponents/Managment")),
  mail: lazy(() => import("../SendMail/mail")),
};

// Botones del menú lateral, en orden.
export const menu = [
  { key: "profesionales", label: "Buscar profesional" },
  { key: "citas", label: "Citas agendadas" },
];
