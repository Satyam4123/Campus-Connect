export default function AuthPageShell({ children }) {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
            `,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-900 to-orange-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-900 to-red-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="absolute w-1 h-1 bg-red-500 rounded-full opacity-30 animate-ping"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-1 lg:order-1 text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black tracking-tight">
                                <span className="block text-white">CAMPUS</span>
                                <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent animate-pulse">
                                    CONNECT
                                </span>
                            </h1>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto lg:mx-0" />
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                                Enter the digital realm where connections forge the future of campus life.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <span>Secure Authentication</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div
                                        className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.5s" }}
                                    />
                                    <span>Real-time Collaboration</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <div
                                        className="w-2 h-2 bg-red-600 rounded-full animate-pulse"
                                        style={{ animationDelay: "1s" }}
                                    />
                                    <span>GitHub Integration</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-2 lg:order-2">{children}</div>
                </div>
            </div>
        </div>
    );
}
