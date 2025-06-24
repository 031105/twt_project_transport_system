import React, { useState, useEffect } from 'react';
import { User, Settings, Edit, Eye, EyeOff, Save, X, Download, Shield, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const { currentUser, addNotification, logout } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    preferredLanguage: 'en'
  });
  
  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: true
  });
  
  // Account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        gender: currentUser.gender || '',
        preferredLanguage: currentUser.preferredLanguage || 'en'
      });
      setNotifications({
        email: currentUser.emailNotifications !== false,
        sms: currentUser.smsNotifications === true,
        marketing: currentUser.marketingConsent === true
      });
    }
    loadBookings();
  }, [currentUser]);

  const loadBookings = async () => {
    if (!currentUser) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserBookings(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setUserBookings([]);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          date_of_birth: profileData.dateOfBirth || null,
          gender: profileData.gender || null,
          preferred_language: profileData.preferredLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update localStorage with new user data
        const updatedUser = { ...currentUser, ...data.data.user };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        addNotification({ type: 'success', message: 'Profile updated successfully!' });
        setIsEditingProfile(false);
        
        // Refresh page to show updated data
        window.location.reload();
      } else {
        const errorData = await response.json();
        addNotification({ type: 'error', message: errorData.error || 'Failed to update profile' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to update profile' });
    }
    setLoading(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      addNotification({ type: 'error', message: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        addNotification({ type: 'success', message: 'Password changed successfully!' });
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const errorData = await response.json();
        addNotification({ type: 'error', message: errorData.error || 'Failed to change password' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to change password' });
    }
    setLoading(false);
  };

  const handleNotificationUpdate = async (type, value) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
    
    try {
      const token = localStorage.getItem('accessToken');
      const updateData = {};
      
      if (type === 'email') updateData.email_notifications = value;
      if (type === 'sms') updateData.sms_notifications = value;
      if (type === 'marketing') updateData.marketing_consent = value;
      
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        addNotification({ type: 'success', message: 'Notification preferences updated!' });
      } else {
        // Revert on error
        setNotifications(prev => ({ ...prev, [type]: !value }));
        addNotification({ type: 'error', message: 'Failed to update preferences' });
      }
    } catch (error) {
      // Revert on error
      setNotifications(prev => ({ ...prev, [type]: !value }));
      addNotification({ type: 'error', message: 'Failed to update preferences' });
    }
  };

  const handleDownloadData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `account-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        addNotification({ type: 'success', message: 'Account data downloaded successfully!' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to download account data' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      addNotification({ type: 'error', message: 'Please type "DELETE" to confirm' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        addNotification({ type: 'success', message: 'Account deleted successfully' });
        logout();
      } else {
        addNotification({ type: 'error', message: 'Failed to delete account' });
      }
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to delete account' });
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {!isEditingProfile ? (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="btn-outline flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleProfileUpdate}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="btn-outline flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">First Name</label>
            {isEditingProfile ? (
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                className="input"
                placeholder="Enter first name"
              />
            ) : (
              <div className="input bg-gray-50">{currentUser?.firstName || 'N/A'}</div>
            )}
          </div>
          <div>
            <label className="label">Last Name</label>
            {isEditingProfile ? (
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                className="input"
                placeholder="Enter last name"
              />
            ) : (
              <div className="input bg-gray-50">{currentUser?.lastName || 'N/A'}</div>
            )}
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="input bg-gray-50">{currentUser?.email || 'N/A'}</div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="label">Phone Number</label>
            {isEditingProfile ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="input"
                placeholder="Enter phone number"
              />
            ) : (
              <div className="input bg-gray-50">{currentUser?.phone || 'Not provided'}</div>
            )}
          </div>
          {isEditingProfile && (
            <>
              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                  className="input"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{userBookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {userBookings.filter(b => b.bookingStatus === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed Trips</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              RM {userBookings.reduce((total, booking) => total + (booking.totalAmount || 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
            </div>
            <ToggleSwitch 
              checked={notifications.email}
              onChange={(value) => handleNotificationUpdate('email', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive trip reminders and updates via SMS</p>
            </div>
            <ToggleSwitch 
              checked={notifications.sms}
              onChange={(value) => handleNotificationUpdate('sms', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Marketing Communications</h4>
              <p className="text-sm text-gray-600">Receive promotional offers and news</p>
            </div>
            <ToggleSwitch 
              checked={notifications.marketing}
              onChange={(value) => handleNotificationUpdate('marketing', value)}
            />
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <div className="space-y-4">
          {!showPasswordForm ? (
            <button 
              onClick={() => setShowPasswordForm(true)}
              className="btn-outline w-full text-left flex items-center justify-between"
            >
              <span>Change Password</span>
              <Shield className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="label">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="input pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="input pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="input pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
                <button 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <button className="btn-outline w-full text-left flex items-center justify-between">
            <span>Two-Factor Authentication</span>
            <Shield className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleDownloadData}
            className="btn-outline w-full text-left flex items-center justify-between"
          >
            <span>Download Account Data</span>
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="btn text-white bg-red-600 hover:bg-red-700 w-full flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        ) : (
          <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-red-800">
              <h4 className="font-medium">Are you absolutely sure?</h4>
              <p className="text-sm mt-1">This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
            </div>
            <div>
              <label className="label text-red-700">Type "DELETE" to confirm:</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="input border-red-300 focus:border-red-500"
                placeholder="DELETE"
              />
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== 'DELETE'}
                className="btn bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default ProfilePage; 