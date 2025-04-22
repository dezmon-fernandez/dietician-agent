import { BrowserRouter } from 'react-router';
import AppRoutes from '@/routes';
import { Provider } from 'react-redux';
import { store } from '@/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="h-full">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
