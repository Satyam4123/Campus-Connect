import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
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
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get("error");
        if (error === "config") {
            setSnackbarMessage("Server configuration error. Please try again later.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            setSearchParams({});
        } else if (error === "signin_failed") {
            setSnackbarMessage("Google sign-in failed. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            setSnackbarMessage("Sign-in is not configured. Please set VITE_API_URL and rebuild.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        window.location.href = `${apiUrl}/auth/google`;
    };

    // const handleGitHubLogin = () => {
    //     // GitHub login not implemented yet
    // };

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        setErrors([]);
        setLoginErrors([]);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password
            });

            if (response.data.success) {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity("success");
                setOpenSnackbar(true);

                localStorage.setItem('token', response.data.data.jwtToken);
                localStorage.setItem('userId', response.data.data.userId);
                localStorage.setItem('user', JSON.stringify({
                    name: response.data.data.name,
                    email: response.data.data.email,
                    userId: response.data.data.userId,
                    department: response.data.data.department,
                    year: response.data.data.year
                }));

                navigate('/dashboard');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.errors) {
                    setLoginErrors(error.response.data.errors);
                } else if (error.response.data.message) {
                    setSnackbarMessage(error.response.data.message);
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                    if (error.response.data.errors) {
                        setLoginErrors(error.response.data.errors);
                    }
                }
            } else {
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
        setSnackbarMessage("Account created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
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
                alert("Signup Successful! Please login");
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

    const closeSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-900 to-orange-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-900 to-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-red-500 rounded-full opacity-30 animate-ping"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div className="order-1 lg:order-1 text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black tracking-tight">
                                <span className="block text-white">CAMPUS</span>
                                <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent animate-pulse">
                                    CONNECT
                                </span>
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto lg:mx-0"></div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                                Enter the digital realm where connections forge the future of campus life.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span>Secure Authentication</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    <span>Real-time Collaboration</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <span>GitHub Integration</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-2 lg:order-2">
                        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">

                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-transparent opacity-20 rounded-bl-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500 to-transparent opacity-20 rounded-tr-3xl"></div>

                            {(errors.length > 0 || loginErrors.length > 0) && (
                                <div className="mb-6 space-y-2">
                                    {[...errors, ...loginErrors].map((error, index) => (
                                        <div key={index} className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                                            {error}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                                <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-4">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="font-medium text-sm">Google</span>
                                </button>

                                {/* <button
                                    onClick={handleGitHubLogin}
                                    className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="white">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    <span className="font-medium text-sm">GitHub</span>
                                </button> */}
                            </div>

                            <div className="flex items-center my-4">
                                <div className="flex-1 border-t border-gray-700"></div>
                                <span className="px-4 text-gray-500 text-xs">OR CONTINUE WITH</span>
                                <div className="flex-1 border-t border-gray-700"></div>
                            </div>

                            <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => handleTabChange(0)}
                                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-300 ${tabValue === 0
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => handleTabChange(1)}
                                    className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-300 ${tabValue === 1
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {tabValue === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                    </div>

                                   

                                    <button
                                        onClick={handleLoginSubmit}
                                        disabled={isLoggingIn}
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-500 hover:shadow-opacity-50"
                                    >
                                        {isLoggingIn ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                                                <span>Signing in...</span>
                                            </div>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>
                                </div>
                            )}

                            {tabValue === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
                                            <input
                                                type="password"
                                                placeholder="Create a strong password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Department</label>
                                                <input
                                                    type="text"
                                                    placeholder="Your department"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">Year</label>
                                                <input
                                                    type="number"
                                                    placeholder="Academic year"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSignUpSubmit}
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500 hover:shadow-opacity-50"
                                    >
                                        Create Account
                                    </button>

                                    <p className="text-xs text-gray-500 text-center leading-tight">
                                        By creating an account, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {openSnackbar && (
                <div className="fixed bottom-6 right-6 z-50 animate-bounce">
                    <div className={`backdrop-blur-xl rounded-xl p-4 border shadow-2xl flex items-center space-x-3 ${snackbarSeverity === 'success'
                            ? 'bg-green-900 bg-opacity-80 border-green-700 text-green-300'
                            : 'bg-red-900 bg-opacity-80 border-red-700 text-red-300'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${snackbarSeverity === 'success' ? 'bg-green-400' : 'bg-red-400'
                            } animate-pulse`}></div>
                        <span className="font-medium">{snackbarMessage}</span>
                        <button
                            onClick={closeSnackbar}
                            className="ml-2 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}