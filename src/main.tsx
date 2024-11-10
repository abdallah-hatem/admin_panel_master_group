import '@/generic/styles/index.less';
import '@/generic/mock';
import './app.css';

import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import store from '@/generic/stores';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
