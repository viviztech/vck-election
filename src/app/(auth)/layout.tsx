export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <img src="/logo.png" alt="விடுதலைச் சிறுத்தைகள் கட்சி" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">விடுதலைச் சிறுத்தைகள் கட்சி</h1>
          <p className="text-gray-500 text-sm mt-1">உறுப்பினர் படிவ நிர்வாக அமைப்பு</p>
        </div>
        {children}
      </div>
    </div>
  );
}
