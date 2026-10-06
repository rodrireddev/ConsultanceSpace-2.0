import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { formatDate } from "../../utils/dates";
import Dashboard from "./ProfessionalDashboard";

// Vistas livianas: lo que se prueba es la navegación, no cada pantalla.
jest.mock("./views", () => {
  const { lazy } = require("react");
  const view = (name) => lazy(async () => ({ default: () => <div>vista {name}</div> }));
  return {
    views: { welcome: view("welcome"), citas: view("citas"), suscripcion: view("suscripcion") },
    menu: [{ key: "citas", label: "Citas agendadas" }],
  };
});
jest.mock("../Header/Buttons/Profile", () => () => null);

const renderWith = (info) => {
  const reducer = () => ({ reducerLog: { user: {}, info } });
  return render(
    <Provider store={createStore(reducer)}>
      <Dashboard />
    </Provider>
  );
};

test("navega entre vistas desde el menú", async () => {
  renderWith({ subscripcion: formatDate(new Date(Date.now() + 5 * 86400000)), mpLinked: true });
  expect(await screen.findByText("vista welcome")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Citas agendadas"));
  expect(await screen.findByText("vista citas")).toBeInTheDocument();
});

test("con la suscripción vencida solo se ve la suscripción y el menú queda bloqueado", async () => {
  renderWith({ subscripcion: formatDate(new Date(Date.now() - 5 * 86400000)), mpLinked: true });
  expect(await screen.findByText("vista suscripcion")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Citas agendadas"));
  expect(screen.queryByText("vista citas")).not.toBeInTheDocument();
  expect(screen.getByText("vista suscripcion")).toBeInTheDocument();
});

test("avisa si todavía no vinculó Mercado Pago", async () => {
  renderWith({ subscripcion: formatDate(new Date(Date.now() + 5 * 86400000)), mpLinked: false });
  expect(await screen.findByText(/configure su sistema de pagos/i)).toBeInTheDocument();
});
