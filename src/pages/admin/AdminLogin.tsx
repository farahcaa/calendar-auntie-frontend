import { usePostAuthLogin } from "@/gen";
import { useState } from "react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const postAuthLogin = usePostAuthLogin();
  const onsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await postAuthLogin.mutateAsync({
        data: { username, password },
      });
      localStorage.setItem("auth", data.access_token);
      window.location.href = "/admin";
    } catch {
      alert("Login failed username or password incorrect");
      return;
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div>
        <div className="text-xl font-bold">Login</div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="admin"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="••••••••"
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            onClick={onsubmit}
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
