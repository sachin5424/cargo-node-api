import React from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.min.css';
// import 'antd/dist/antd.dark.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import util from './utils/util';
// import Test from './views/components/Test';

(async () => {
  if (util.getTheme() === 'dark') {
    await util.setTheme('dark');
  } else {
    await util.setTheme('light');
  }
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
})();


// ReactDOM.render(
//     <Test />,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
