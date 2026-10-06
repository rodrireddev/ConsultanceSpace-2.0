import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import Nav from './components/Header/Nav';
import Footer from './components/Footer/Footer';
import Main from './components/Main/Main';
import Loading from './components/Dashboard/Loading';
import PatientsRouter from './components/Log/privateroutes/Patientsrouter';
import ProfesionalRouter from './components/Log/privateroutes/Profesionalrouter ';

// Todo lo que no es la home se carga bajo demanda (dashboards, registro, pagos...).
// Cada ruta tiene su propio Suspense para que Nav y Footer no desaparezcan mientras carga.
const lazyPage = (importer) => {
  const Page = lazy(importer);
  return function LazyPage(props) {
    return (
      <Suspense fallback={<Loading />}>
        <Page {...props} />
      </Suspense>
    );
  };
};

const Dashboard = lazyPage(() => import('./components/Professional/ProfessionalDashboard'));
const PatientsDashboard = lazyPage(() => import('./components/Patient/PatientsDashboard'));
const Sign = lazyPage(() => import('./components/Sign/Sign'));
const GoogleSign = lazyPage(() => import('./components/Sign/googlesign'));
const Log = lazyPage(() => import('./components/Log/Log'));
const ResetPassword = lazyPage(() => import('./components/ResetPassword/ResetPassword'));
const Succes = lazyPage(() => import('./components/payments/succes'));
const PaymentsConfig = lazyPage(() => import('./components/payments/PaymentsConfig'));
const Subscripcion = lazyPage(() => import('./components/payments/Subscription'));

function App() {
  return (
    <>
      <Route path="/sign-in" component={Sign}/>
      <Route path="/sign-ing" component={GoogleSign}/>
      <Route path="/login" component={Log}/>
      <Route path="/reset-password" component={ResetPassword}/>
      <Route path="/" component={Nav}/>
      <ProfesionalRouter exact path="/profesional-dashboard" component={Dashboard}/>
      <PatientsRouter exact path="/patient-dashboard" component={PatientsDashboard}/>
      <Route path="/succes" component={Succes}/>
      <Route path="/failure" component={Succes}/>
      <Route path="/pending" component={Succes}/>
      <Route path="/subscription" component={Subscripcion}/>
      <Route path="/payments" component={PaymentsConfig}/>
      <Route exact path="/" component={Main}/>
      <Route path="/" component={Footer}/>
    </>
  );
}

export default App;
