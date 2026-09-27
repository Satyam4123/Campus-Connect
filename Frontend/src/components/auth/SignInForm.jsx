import ActionButton from "../ui/ActionButton";
import FormInput from "../ui/FormInput";

export default function SignInForm({
    email,
    password,
    isLoggingIn,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-3">
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={onPasswordChange}
                />
            </div>

            <ActionButton
                type="button"
                onClick={onSubmit}
                isLoading={isLoggingIn}
                loadingText="Signing in..."
                className="w-full py-3 px-6"
            >
                Sign In
            </ActionButton>
        </div>
    );
}
