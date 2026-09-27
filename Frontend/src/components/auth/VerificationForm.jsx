import ActionButton from "../ui/ActionButton";
import FormInput from "../ui/FormInput";

export default function VerificationForm({
    showVerification,
    verificationToken,
    isVerifying,
    onToggleShow,
    onVerificationTokenChange,
    onSubmit,
}) {
    if (!showVerification) {
        return (
            <div className="mt-6 border-t border-gray-700 pt-5">
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800/70 px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-red-500 hover:text-white hover:bg-gray-800"
                >
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Already signed up? Verify your email
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="mt-6 border-t border-gray-700 pt-5 space-y-3">
            <FormInput
                label="Verification Token"
                type="text"
                inputMode="text"
                placeholder="Paste your email verification token"
                value={verificationToken}
                onChange={onVerificationTokenChange}
            />
            <ActionButton
                type="submit"
                variant="ghost"
                isLoading={isVerifying}
                loadingText="Verifying..."
                disabled={verificationToken.trim().length === 0}
                className="w-full py-2.5 px-6"
            >
                Verify Email
            </ActionButton>
        </form>
    );
}
