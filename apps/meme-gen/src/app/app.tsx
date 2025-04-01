import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              Hello Wrold!
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              Bye world!
              <Link to="/">Click here for page 1.</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
