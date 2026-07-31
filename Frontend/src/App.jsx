import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="app">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
