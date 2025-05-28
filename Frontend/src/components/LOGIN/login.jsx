import { useState } from "react";
import { Button, Input, Tabs, Tab, Box,Alert,Snackbar } from "@mui/material";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");

  const [tabValue, setTabValue] = useState(0);
  const [errors, setErrors] = useState([]);
  const [loginErrors, setLoginErrors] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrors([]);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors([]);
    setIsLoggingIn(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password
      });

      if (response.data.success) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Store user data and token
        localStorage.setItem('token', response.data.data.jwtToken);
        localStorage.setItem('userId', response.data.data.userId);
        localStorage.setItem('user', JSON.stringify({
          name: response.data.data.name,
          email: response.data.data.email,
          userId: response.data.data.userId,
          department: response.data.data.department,
          year: response.data.data.year
        }));

        // Redirect to dashboard or home page
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          // Joi validation errors
          setLoginErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          // Authentication errors
          setSnackbarMessage(error.response.data.message);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);

          if (error.response.data.errors) {
            setLoginErrors(error.response.data.errors);
          }
        }
      } else {
        // Network errors
        setSnackbarMessage("Network error. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrors([]); 

    try {
      const response = await axios.post("http://localhost:3000/auth/signup", {
        name,
        email,
        password,
        department,
        year
      });

      if (response.data.success) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        alert("Signup Successful! Please login")
        setTabValue(0);
        setName("");
        setEmail("");
        setPassword("");
        setDepartment("");
        setYear("");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          setSnackbarMessage(error.response.data.message);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } else {

        setSnackbarMessage("Network error. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <main className="flex items-center justify-center bg-black min-h-screen p-20">
      <div className="w-1/2">
        <img src={assets.fireimg} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <h1 className="text-red-700 font-bold text-6xl">CAMPUS CONNECT</h1>
        {errors.length > 0 && (
          <div className="w-full max-w-md mb-4">
            {errors.map((error, index) => (
              <Alert key={index} severity="error" className="mb-2">
                {error}
              </Alert>
            ))}
          </div>
        )}
        

        <p className="text-gray-300 mt-4">Express login via Google</p>

        <Button
          variant="outlined"
          className="mt-4 border-gray-300 text-gray-300 hover:border-white hover:text-white"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FF6B2B" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FF6B2B" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FF6B2B" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#FF6B2B" />
          </svg>
          Google
        </Button>

        <div className="flex items-center my-4 w-full">
          <div className="flex-1 border-t border-gray-500"></div>
          <span className="px-4 text-gray-300">or</span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Tabs value={tabValue} onChange={handleTabChange} className="mb-4 text-white">
          <Tab label="Log in" className="text-white" />
          <Tab label="Sign up" className="text-white" />
        </Tabs>

        <Box className="w-full max-w-md">
          {tabValue === 0 && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginErrors.length > 0 && (
                <div className="mb-4">
                  {loginErrors.map((error, index) => (
                    <Alert key={index} severity="error" className="mb-2">
                      {error}
                    </Alert>
                  ))}
                </div>
              )}

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={loginErrors.some(e => e.includes("Email"))}
                required
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={loginErrors.some(e => e.includes("Password"))}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Log in"}
              </Button>
            </form>
          )}

          {tabValue === 1 && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className=" h-48 overflow-y-scroll flex flex-col gap-3 p-2">

              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={errors.some(e => e.includes("Name"))}
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={errors.some(e => e.includes("Email"))}
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={errors.some(e => e.includes("Password"))}
              />

              <Input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={errors.some(e => e.includes("Department"))}
              />

              <Input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                variant="outlined"
                fullWidth
                className="bg-white rounded-lg p-2"
                error={errors.some(e => e.includes("Year"))}
              />
              </div>

              <Button type="submit" variant="contained" color="primary" className="w-full">
                Sign Up
              </Button>
            </form>
          )}
        </Box>
      </div>
    </main>
  );
}