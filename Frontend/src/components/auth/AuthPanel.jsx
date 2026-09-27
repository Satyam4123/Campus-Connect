import GoogleAuthButton from "./GoogleAuthButton";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import VerificationForm from "./VerificationForm";

export default function AuthPanel({
    errors,
    loginErrors,
    tabValue,
    onTabChange,
    onGoogleLogin,
    formState,
    onFormChange,
    onLoginSubmit,
    onSignUpSubmit,
    signupStep,
    onSignupStepChange,
    showVerification,
    verificationToken,
    isVerifying,
    onVerificationTokenChange,
    onVerifyEmail,
    onToggleVerification,
}) {
    return (
        <div className="bg-gray-900 bg-opacity-80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden my-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-transparent opacity-20 rounded-bl-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-500 to-transparent opacity-20 rounded-tr-3xl" />

            <div className="relative z-10">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">
                        {tabValue === 0 ? "Welcome Back" : "Create Your Account"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {tabValue === 0
                            ? "Enter your credentials to access your account"
                            : "Set up your Campus Connect profile"}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4">
                    <GoogleAuthButton onClick={onGoogleLogin} />
                </div>

                <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-700" />
                    <span className="px-4 text-gray-500 text-xs">OR CONTINUE WITH</span>
                    <div className="flex-1 border-t border-gray-700" />
                </div>

                <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
                    {[
                        { label: "Sign In", value: 0 },
                        { label: "Sign Up", value: 1 },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => onTabChange(tab.value)}
                            className={`flex-1 py-3 px-6 rounded-md font-medium transition-all duration-300 ${tabValue === tab.value
                                ? "bg-red-600 text-white shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {tabValue === 0 ? (
                    <SignInForm
                        email={formState.email}
                        password={formState.password}
                        isLoggingIn={formState.isLoggingIn}
                        onEmailChange={(event) => onFormChange("email", event.target.value)}
                        onPasswordChange={(event) => onFormChange("password", event.target.value)}
                        onSubmit={onLoginSubmit}
                    />
                ) : (
                    <SignUpForm
                        signupStep={signupStep}
                        onSignupStepChange={onSignupStepChange}
                        name={formState.name}
                        email={formState.email}
                        password={formState.password}
                        department={formState.department}
                        year={formState.year}
                        isSigningUp={formState.isSigningUp}
                        onNameChange={(event) => onFormChange("name", event.target.value)}
                        onEmailChange={(event) => onFormChange("email", event.target.value)}
                        onPasswordChange={(event) => onFormChange("password", event.target.value)}
                        onDepartmentChange={(event) => onFormChange("department", event.target.value)}
                        onYearChange={(event) => onFormChange("year", event.target.value)}
                        onSubmit={onSignUpSubmit}
                    />
                )}

                <VerificationForm
                    showVerification={showVerification}
                    verificationToken={verificationToken}
                    isVerifying={isVerifying}
                    onToggleShow={onToggleVerification}
                    onVerificationTokenChange={(event) => onVerificationTokenChange(event.target.value)}
                    onSubmit={onVerifyEmail}
                />
            </div>
        </div>
    );
}
