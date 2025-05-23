import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { userService } from '../services/user.service';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { UserDto, UserRole } from '../types';

/**
 * Admin Users Management Page
 * 
 * This component provides an interface for managing user accounts with different roles (User, Artist, Admin).
 * It supports creating, reading, updating, and deleting user accounts with role-based access control.
 * The UI includes a data table with user information and a form for adding/editing users.
 */
const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.USER
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getAllUsers();
      if (response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (error) {
      setError('An error occurred while fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.USER
    });
    setEditingUser(null);
    setShowAddForm(false);
  };
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      console.log('Submitting user data:', formData);
      const response = await userService.createUser(formData);
      
      if (response.data) {
        setUsers([...users, response.data]);
        setSuccess('User created successfully');
        resetForm();
      } else {
        setError(response.error || 'Failed to create user');
      }
    } catch (error: any) {
      setError(`An error occurred while creating the user: ${error.message || ''}`);
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || editingUser.id === undefined) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!formData.name || !formData.email || !formData.role) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      const updateData: Partial<UserDto> = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }
      
      console.log('Updating user with data:', updateData);
      const response = await userService.updateUser(editingUser.id, updateData);
      
      if (response.data) {
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === editingUser.id ? response.data! : user
        ));
        setSuccess('User updated successfully');
        resetForm();
      } else {
        setError(response.error || 'Failed to update user');
      }
    } catch (error: any) {
      setError(`An error occurred while updating the user: ${error.message || ''}`);
      console.error('Error updating user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await userService.deleteUser(userId);
      if (response.status === 204) {
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('User deleted successfully');
      } else if (response.error) {
        setError(response.error);
      } else {
        setError('Failed to delete user');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Unexpected error occurred');
      console.error('Error deleting user:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startEditing = (user: UserDto) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role as UserRole || UserRole.USER
    });
    setShowAddForm(true);
  };
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-macchiato-red/20 text-macchiato-red';
      case UserRole.ARTIST:
        return 'bg-macchiato-yellow/20 text-macchiato-yellow';
      default:
        return 'bg-macchiato-blue/20 text-macchiato-blue';
    }
  };
  
  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-macchiato-text">Manage Users</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-macchiato-green/20 border border-macchiato-green text-macchiato-green px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}
      
      {showAddForm && (
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label={editingUser ? "Password (leave blank to keep current)" : "Password"}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!editingUser}
              />
              
              <div className="flex flex-col">
                <label className="text-macchiato-text mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="bg-macchiato-surface0 border border-macchiato-overlay0 text-macchiato-text rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-macchiato-mauve/20 focus:border-macchiato-mauve"
                >
                  <option value={UserRole.USER}>User</option>
                  <option value={UserRole.ARTIST}>Artist</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isLoading}
              >
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-macchiato-surface0/80 backdrop-blur-glass shadow-neumorphic-dark rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-macchiato-mantle">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-macchiato-subtext0 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-macchiato-overlay0/20">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-macchiato-surface1/30">
                    <td className="px-6 py-4 whitespace-nowrap text-macchiato-text">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-macchiato-text">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role || '')}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="text-macchiato-blue hover:text-macchiato-mauve transition-colors"
                          title="Edit user"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => user.id !== undefined && handleDeleteUser(user.id)}
                          className="text-macchiato-red hover:text-macchiato-red/80 transition-colors"
                          title="Delete user"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-macchiato-subtext0">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="glass-card rounded-lg p-4 shadow-neumorphic-dark"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-macchiato-text">{user.name}</div>
                  <div className="text-macchiato-subtext0 text-sm">{user.email}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(user.role || '')}`}>{user.role}</span>
              </div>
              <div className="flex justify-end space-x-3 mt-2">
                <button
                  onClick={() => startEditing(user)}
                  className="text-macchiato-blue hover:text-macchiato-mauve transition-colors text-xl"
                  title="Edit user"
                  aria-label="Edit user"
                >
                  <FiEdit2 size={22} />
                </button>
                <button
                  onClick={() => user.id !== undefined && handleDeleteUser(user.id)}
                  className="text-macchiato-red hover:text-macchiato-red/80 transition-colors text-xl"
                  title="Delete user"
                  aria-label="Delete user"
                >
                  <FiTrash2 size={22} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-macchiato-subtext0 py-6">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
