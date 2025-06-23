import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AssignManagerModal from './AssignManagerModal';
import { FiPlus } from 'react-icons/fi';

const AdminManager = () => {
    // const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [AssignedManagers, setAssignedManagers] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [assignedList, setAssignedList] = useState([]);

    
    
    const role = 'admin';


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const fetchAssignedProjectManagers = async () => {
        try {
            const res = await axios.get('http://localhost/cv-portal/backend/api/project/assigned-managers', {
                withCredentials: true,
            });

            if (res.data.status) {
                setAssignedList(res.data.data);
            } else {
                toast.error('Failed to load assigned projects');
            }
        } catch {
            toast.error('Server error fetching assignments');
        }
    };


    useEffect(() => {
        fetchAssignedProjectManagers();
    }, []);




    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar role={role} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
                <Topbar role={role} toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 mt-16 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        {/* <div className="p-6"> */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">User Management</h2>
                            <button
                                onClick={() => setAssignedManagers(true)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <FiPlus className="mr-2" />
                                Assign Project
                            </button>
                        </div>

                        <div className="bg-white shadow rounded overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">Manager Name</th>
                                        <th className="p-3 text-left">Manager Email</th>
                                        <th className="p-3 text-left">Project Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedList.map(item => (
                                        <tr key={item.id} className="border-t">
                                            <td className="p-3">{item.manager_name}</td>
                                            <td className="p-3">{item.email}</td>
                                            <td className="p-3">{item.project_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {assignedList.length === 0 && !loading && (
                                <div className="p-6 text-center text-gray-500">No assignments found.</div>
                            )}
                        </div>

                        {AssignedManagers && (
                            <AssignManagerModal
                                onClose={() => setAssignedManagers(false)}
                                onSuccess={() => fetchAssignedProjectManagers?.()}
                            />
                        )}
                         
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminManager;