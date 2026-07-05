import React, { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

export default function App() {
  const [role, setRole] = useState<'admin' | 'employee' | null>(null);
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');

  const handleSelectRole = (selectedRole: 'admin' | 'employee', user?: string, dept?: string) => {
    setRole(selectedRole);
    if (user) setUsername(user);
    if (dept) setDepartment(dept);
  };

  const handleLogout = () => {
    setRole(null);
    setUsername('');
    setDepartment('');
  };

  return (
    <div className="min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {role === null && (
        <RoleSelector onSelectRole={handleSelectRole} />
      )}

      {role === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {role === 'employee' && (
        <EmployeeDashboard
          employeeName={username}
          employeeDept={department}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
