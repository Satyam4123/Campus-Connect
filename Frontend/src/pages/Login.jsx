import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPageShell from "../components/auth/AuthPageShell";
import AuthPanel from "../components/auth/AuthPanel";
import AuthSnackbar from "../components/auth/AuthSnackbar";

export default function LoginPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [tabValue, setTabValue] = useState(0);
    const [errors, setErrors] = useState([]);
    const [loginErrors, setLoginErrors] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [signupStep, setSignupStep] = useState(0);

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

    const clearErrors = () => {
        setErrors([]);
        setLoginErrors([]);
    };

    const showErrorSnackbar = (messages = []) => {
        const normalized = Array.isArray(messages) ? messages.filter(Boolean) : [messages].filter(Boolean);
        if (!normalized.length) return;

        setSnackbarMessage(normalized.join(" "));
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
    };

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

    const handleTabChange = (newValue) => {
        setTabValue(newValue);
        clearErrors();

        if (newValue === 1) {
            setSignupStep(0);
        }
    };

    const validateSignupStep = (step) => {
        const nextErrors = [];

        if (step === 0) {
            if (!email.trim()) nextErrors.push("Email is required.");
            if (!password.trim()) nextErrors.push("Password is required.");
        }

        if (step === 1) {
            if (!name.trim()) nextErrors.push("Name is required.");
            if (!year || Number(year) <= 0) nextErrors.push("Please enter a valid year.");
        }

        if (step === 2) {
            if (!department.trim()) nextErrors.push("Department is required.");
        }

        setErrors(nextErrors);
        if (nextErrors.length) {
            showErrorSnackbar(nextErrors);
        }
        return nextErrors.length === 0;
    };

    const handleSignupStepChange = (nextStep) => {
        if (nextStep > signupStep) {
            const isValid = validateSignupStep(signupStep);
            if (!isValid) return;
        }

        setSignupStep(nextStep);
        setErrors([]);
    };

    const handleLoginSubmit = async () => {
        if (isLoggingIn) return;
        setIsLoggingIn(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity("success");
                setOpenSnackbar(true);

                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("userId", response.data.data.userId);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        name: response.data.data.name,
                        email: response.data.data.email,
                        userId: response.data.data.userId,
                        department: response.data.data.department,
                        year: response.data.data.year,
                    })
                );

                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data.errors) {
                    showErrorSnackbar(error.response.data.errors);
                    setLoginErrors(error.response.data.errors);
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
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSignUpSubmit = async () => {
        if (isSigningUp) return;

        const validationErrors = [];
        if (!email.trim()) validationErrors.push("Email is required.");
        if (!password.trim()) validationErrors.push("Password is required.");
        if (!name.trim()) validationErrors.push("Name is required.");
        if (!year || Number(year) <= 0) validationErrors.push("Please enter a valid year.");
        if (!department.trim()) validationErrors.push("Department is required.");

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            showErrorSnackbar(validationErrors);
            return;
        }

        setErrors([]);
        setIsSigningUp(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
                name,
                email,
                password,
                department,
                year,
            });

            if (response.data.success) {
                setSnackbarMessage("Check your email for the verification token.");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
                setTabValue(0);
                setSignupStep(0);
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
                    showErrorSnackbar(error.response.data.errors);
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
        } finally {
            setIsSigningUp(false);
        }
    };

    const handleVerifyEmail = async (event) => {
        event.preventDefault();
        if (isVerifying) return;

        setIsVerifying(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-email`, {
                token: verificationToken.trim(),
            });

            setSnackbarMessage(response.data.message || "Email verified successfully. Please sign in.");
            setSnackbarSeverity(response.data.success ? "success" : "error");
            setOpenSnackbar(true);
            setVerificationToken("");
            setShowVerification(false);
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || "Verification failed. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setIsVerifying(false);
        }
    };

    const closeSnackbar = () => {
        setOpenSnackbar(false);
    };

    const formState = {
        name,
        email,
        password,
        department,
        year,
        isLoggingIn,
        isSigningUp,
    };

    return (
        <>
            <AuthPageShell>
                <AuthPanel
                    errors={errors}
                    loginErrors={loginErrors}
                    tabValue={tabValue}
                    onTabChange={handleTabChange}
                    onGoogleLogin={handleGoogleLogin}
                    formState={formState}
                    onFormChange={(field, value) => {
                        if (field === "name") setName(value);
                        if (field === "email") setEmail(value);
                        if (field === "password") setPassword(value);
                        if (field === "department") setDepartment(value);
                        if (field === "year") setYear(value);
                    }}
                    onLoginSubmit={handleLoginSubmit}
                    onSignUpSubmit={handleSignUpSubmit}
                    signupStep={signupStep}
                    onSignupStepChange={handleSignupStepChange}
                    showVerification={showVerification}
                    verificationToken={verificationToken}
                    isVerifying={isVerifying}
                    onVerificationTokenChange={setVerificationToken}
                    onVerifyEmail={handleVerifyEmail}
                    onToggleVerification={() => setShowVerification((prev) => !prev)}
                />
            </AuthPageShell>

            <AuthSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={closeSnackbar}
            />
        </>
    );
}
