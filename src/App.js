import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { AutomaticIntlProvider } from './i18n';
import { AppRouter } from './routes';
import store from './store';
import history from './history';

export function App() {
    return (
        <Provider store={store}>
            <AutomaticIntlProvider>
                <Router history={history}>
                    <AppRouter/>
                </Router>
            </AutomaticIntlProvider>
        </Provider>
    );
}
