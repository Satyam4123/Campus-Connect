import ActionButton from "../ui/ActionButton";
import FormInput from "../ui/FormInput";

export default function SignUpForm({
    signupStep,
    onSignupStepChange,
    name,
    email,
    password,
    department,
    year,
    isSigningUp,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onDepartmentChange,
    onYearChange,
    onSubmit,
}) {
    const isStepOne = signupStep === 0;
    const isStepTwo = signupStep === 1;

    return (
        <div className="space-y-3">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <span>Step {signupStep + 1} of 3</span>
                <span>{isStepOne ? "Account" : isStepTwo ? "Profile" : "Department"}</span>
            </div>

            {isStepOne ? (
                <div className="grid gap-3">
                    <FormInput
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={onEmailChange}
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                </div>
            ) : isStepTwo ? (
                <div className="grid gap-3">
                    <FormInput
                        label="Full Name"
                        placeholder="Your name"
                        value={name}
                        onChange={onNameChange}
                    />
                    <FormInput
                        label="Year"
                        type="number"
                        placeholder="Academic year"
                        value={year}
                        onChange={onYearChange}
                    />
                </div>
            ) : (
                <div className="grid gap-3">
                    <FormInput
                        label="Department"
                        placeholder="Your department"
                        value={department}
                        onChange={onDepartmentChange}
                    />
                </div>
            )}

            <div className="flex gap-3">
                {signupStep > 0 && (
                    <ActionButton
                        type="button"
                        variant="secondary"
                        onClick={() => onSignupStepChange(signupStep - 1)}
                        className="flex-1 py-3 px-4"
                    >
                        Back
                    </ActionButton>
                )}

                {signupStep < 2 ? (
                    <ActionButton
                        type="button"
                        variant="primary"
                        onClick={() => onSignupStepChange(signupStep + 1)}
                        className="flex-1 py-3 px-4"
                    >
                        Next
                    </ActionButton>
                ) : (
                    <ActionButton
                        type="button"
                        onClick={onSubmit}
                        isLoading={isSigningUp}
                        loadingText="Creating account..."
                        className="flex-1 py-3 px-4"
                    >
                        Create Account
                    </ActionButton>
                )}
            </div>

        </div>
    );
}
