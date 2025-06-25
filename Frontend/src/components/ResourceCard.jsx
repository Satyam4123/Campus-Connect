export default function ResourceCard({ resource, onClick }) {
    return (
        <div
            onClick={() => onClick(resource)}
            className="p-4 border rounded-lg shadow hover:bg-gray-50 cursor-pointer"
        >
            <h3 className="text-lg font-semibold text-blue-600">{resource.title}</h3>
            {resource.description && (
                <p className="text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">Uploaded by {resource.uploader}</p>
        </div>
    );
}
