import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from './redux/store/store';
import App from './App';

// reactfire arrastra todo firebase (firestore, etc.), que no corre en jsdom.
jest.mock('reactfire', () => ({
  useUser: () => ({ data: null }),
  useFirebaseApp: () => ({}),
}));

test('App renderiza la home sin romper', () => {
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </Provider>
  );
  expect(container.firstChild).not.toBeNull();
});
