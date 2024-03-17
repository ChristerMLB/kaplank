import '../App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Register from './Register';
import Planke from './Planke';
import Login from './Login';
import DemoPlanke from './DemoPlanke';
import Welcome from './Welcome';
import PasswordRecovery from './PasswordRecovery';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Theme } from '../contexts/ThemeProvider';
import Dashboard from './Dashboard';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Theme>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<DemoPlanke />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/pw-recovery" element={<PasswordRecovery />} />

            <Route path=":user/:board" element={<PrivateRoute><Planke /></PrivateRoute>} />
            <Route exact path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </Theme>
      </AuthProvider>
    </Router>
  );
}

export default App;