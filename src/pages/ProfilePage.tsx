import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiSave, FiX, FiLogOut } from 'react-icons/fi';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/user.service';
import { UserDto } from '../types';

/**
 * Profile Page
 * 
 * Displays and manages user profile information including personal details and password changes.
 * Handles form validation, error states, and success messages for profile updates.
 * Provides a clean UI for viewing and editing profile information.
 */
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [profile, setProfile] = useState<UserDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      try {
        const response = await userService.getUserById(String(user.id));
        if (response.data) {
          setProfile(response.data);
          setFormData({
            name: response.data.name || '',
            email: response.data.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
        isValid = false;
      }
      
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (!validationErrors) {
      setErrors({});
    }
    
    if (!validationErrors && Object.keys(errors).length > 0) {
      return;
    }
    
    if (!user?.id) {
      setErrors({
        form: 'User information not available. Please log in again.'
      });
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const updateData: Partial<UserDto> = {
        name: formData.name,
        email: formData.email
      };
      
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }
      
      const emailChanged = profile?.email !== formData.email;
      
      const response = await userService.updateUser(Number(user.id), updateData);
      
      if (response.data) {
        setProfile(response.data);
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        if (emailChanged) {
          console.log('Email changed, refreshing authentication...');
          setSuccessMessage('Email updated successfully. You will be redirected to login page in a moment.');
          
          setTimeout(() => {
            logout();
            window.location.href = '/login';
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      if (error.response && error.response.status === 403) {
        setErrors({
          form: 'Permission denied. Your session may have expired. Please log in again.'
        });
        
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 2000);
      } else {
        setErrors({
          form: 'Failed to update profile. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-macchiato-mauve"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-macchiato-text mb-6">Your Profile</h1>
      
      <Card className="p-6">
        {successMessage && (
          <div className="bg-macchiato-green/20 border border-macchiato-green text-macchiato-green px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}
        
        {errors.form && (
          <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg mb-4">
            {errors.form}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-macchiato-surface0 rounded-full flex items-center justify-center mr-4">
              <FiUser className="text-macchiato-mauve" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-macchiato-text">{profile.name}</h2>
              <p className="text-macchiato-subtext0">{profile.email}</p>
            </div>
          </div>
          {/* Actions: Edit/Cancel and Logout */}
          {!isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end items-end sm:items-center">
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="flex items-center px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base"
                aria-label="Edit Profile"
              >
                <FiEdit className="sm:mr-2" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-base text-macchiato-text hover:text-macchiato-red mt-2 sm:mt-0"
                aria-label="Logout"
              >
                <FiLogOut className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  setFormData({
                    name: profile.name || '',
                    email: profile.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="flex items-center"
                aria-label="Cancel"
              >
                <FiX className="sm:mr-2" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              fullWidth
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              fullWidth
            />
            
            <div className="mt-6 mb-4">
              <h3 className="text-lg font-medium text-macchiato-text mb-2">Change Password</h3>
              <p className="text-macchiato-subtext0 text-sm mb-4">
                Leave blank if you don't want to change your password
              </p>
            </div>
            
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              fullWidth
            />
            
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              fullWidth
            />
            
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              fullWidth
            />
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex items-center"
              >
                <FiSave className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-macchiato-subtext0">Account Type</h3>
              <p className="text-macchiato-text">{profile.role}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-macchiato-subtext0">Member Since</h3>
              <p className="text-macchiato-text">
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
          </div>
        )}
      </Card>

    </div>
  );
};
