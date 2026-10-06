import { createContext, useContext } from "react";

// Permite que cualquier pantalla del dashboard pida cambiar de vista: goTo("citas").
const ViewContext = createContext({ goTo: () => {} });

export const ViewProvider = ViewContext.Provider;
export const useGoTo = () => useContext(ViewContext).goTo;
