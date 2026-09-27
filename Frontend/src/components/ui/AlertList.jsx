export default function AlertList({ errors = [] }) {
    if (!errors.length) return null;

    return (
        <div className="mb-6 space-y-2">
            {errors.map((error, index) => (
                <div
                    key={`${error}-${index}`}
                    className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded-lg"
                >
                    {error}
                </div>
            ))}
        </div>
    );
}
