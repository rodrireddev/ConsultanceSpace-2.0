import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import store from '../../../redux/store/store';
import firebaseConfig from '../../../firebase/firebase';
import Nav from '../Nav';

test('render nav', () => {
  const { container } = render(
    <Provider store={store}>
      <FirebaseAppProvider firebaseConfig={{ ...firebaseConfig, apiKey: 'test' }}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </FirebaseAppProvider>
    </Provider>
  );
  expect(container.firstChild).not.toBeNull();
});
