import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '../types';
import { SAMPLE_STORIES } from '../constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPPORT_EMAIL = 'support.truyengenius@gmail.com';

// Mock Owner Account - Hardcoded as requested
const OWNER_EMAIL = 'Lainamiu@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Calculate Level based on thanks
  const calculateLevel = (thanks: number): number => {
    if (thanks >= 2000) return 5;
    if (thanks >= 1000) return 4;
    if (thanks >= 500) return 3;
    if (thanks >= 100) return 2;
    return 1;
  };

  useEffect(() => {
    // Load users from storage or init with mock
    const usersStr = localStorage.getItem('tg_users');
    let users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Ensure the Specific Owner Exists
    if (!users.find(u => u.email === OWNER_EMAIL)) {
        const owner: User = {
            id: 'owner-lainamiu',
            email: OWNER_EMAIL,
            password: 'admin', // Default password for demo
            displayName: 'Lainamiu (Owner)',
            role: 'owner',
            thanksReceived: 9999,
            level: 5,
            favorites: [],
            likedStories: [],
            bio: 'Chủ sở hữu hệ thống TruyệnGenius.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Lainamiu&background=ffd700&color=fff'
        };
        users.push(owner);
        
        // Remove old mock owner if exists to avoid clutter
        users = users.filter(u => u.email !== 'admin@truyengenius.com');
        
        localStorage.setItem('tg_users', JSON.stringify(users));
    }
    setAllUsers(users);

    // Check session
    const storedUser = localStorage.getItem('tg_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUserToStorage = (userData: User) => {
      setUser(userData);
      localStorage.setItem('tg_current_user', JSON.stringify(userData));
      updateUserInList(userData);
  };

  const updateUserInList = (updatedUser: User) => {
      const newUsers = allUsers.map(u => u.id === updatedUser.id || u.email === updatedUser.email ? updatedUser : u);
      setAllUsers(newUsers);
      localStorage.setItem('tg_users', JSON.stringify(newUsers));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPass } = foundUser;
      const userToStore = { ...userWithoutPass } as User; // Refresh data
      saveUserToStorage(userToStore);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) return false;
    
    const newUser: User = { 
        id: Date.now().toString(),
        email, 
        password, 
        role: 'user',
        displayName: email.split('@')[0],
        favorites: [],
        likedStories: [],
        thanksReceived: 0,
        level: 1
    };
    
    const newAllUsers = [...allUsers, newUser];
    setAllUsers(newAllUsers);
    localStorage.setItem('tg_users', JSON.stringify(newAllUsers));
    
    const { password: p, ...userWithoutPass } = newUser;
    saveUserToStorage(userWithoutPass as User);
    
    return true;
  };

  const forgotPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const userExists = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!userExists) return { success: false, message: 'Email chưa đăng ký.' };
    
    const resetToken = btoa(email + '_' + Date.now());
    localStorage.setItem('tg_reset_token_' + resetToken, email);
    return { success: true, message: `Email khôi phục đã gửi từ ${SUPPORT_EMAIL}.`, token: resetToken };
  };

  const resetPassword = async (token: string, newPass: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const email = localStorage.getItem('tg_reset_token_' + token);
    if (!email) return false;
    
    const targetUser = allUsers.find(u => u.email === email);
    if (!targetUser) return false;

    const updatedUser = { ...targetUser, password: newPass };
    updateUserInList(updatedUser);
    localStorage.removeItem('tg_reset_token_' + token);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tg_current_user');
  };

  const updateProfile = async (data: Partial<User>) => {
      if (!user) return false;
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser = { ...user, ...data };
      saveUserToStorage(updatedUser);
      return true;
  };

  const toggleFavorite = (storyId: string) => {
      if (!user) return;
      const isFav = user.favorites.includes(storyId);
      const newFavs = isFav ? user.favorites.filter(id => id !== storyId) : [...user.favorites, storyId];
      saveUserToStorage({ ...user, favorites: newFavs });
  };

  const toggleLike = (storyId: string) => {
      if (!user) return;
      const isLiked = user.likedStories.includes(storyId);
      const newLikes = isLiked ? user.likedStories.filter(id => id !== storyId) : [...user.likedStories, storyId];
      saveUserToStorage({ ...user, likedStories: newLikes });
  };

  const sendThanks = (storyId: string) => {
      if (!user) return;
      // In a real app, this would increment stats on the story and the uploader
      // Here we simulate updating the story locally in the UI (mock logic only affects local session for demo)
      
      // Find the story owner (uploader) in our allUsers list to increment their stats
      const story = SAMPLE_STORIES.find(s => s.id === storyId);
      if (story) {
          const uploader = allUsers.find(u => u.id === story.uploaderId);
          if (uploader) {
              const newThanks = (uploader.thanksReceived || 0) + 1;
              const newLevel = calculateLevel(newThanks);
              const updatedUploader = { ...uploader, thanksReceived: newThanks, level: newLevel };
              updateUserInList(updatedUploader);
              
              // If current user is the uploader (self-thank?), update session
              if (user.id === uploader.id) {
                  saveUserToStorage(updatedUploader);
              }
          }
      }
  };

  const isFavorite = (storyId: string) => user?.favorites.includes(storyId) || false;
  const hasLiked = (storyId: string) => user?.likedStories.includes(storyId) || false;

  // --- Management Functions ---

  const deleteStory = (storyId: string) => {
      if (!user || (user.role !== 'owner' && user.role !== 'co-owner')) return;
      // Real app: API call. Demo: Alert.
      alert(`Đã xóa truyện ID: ${storyId} khỏi hệ thống (Demo).`);
  };

  const deleteComment = (storyId: string, commentId: string) => {
      if (!user || (user.role !== 'owner' && user.role !== 'co-owner')) return;
      // Real app: API call
      alert(`Đã xóa bình luận ID: ${commentId} vi phạm nội quy.`);
  };

  const promoteUser = (userId: string) => {
      if (!user || user.role !== 'owner') return;
      const target = allUsers.find(u => u.id === userId);
      if (target) {
          updateUserInList({ ...target, role: 'co-owner' });
          alert(`Đã bổ nhiệm ${target.displayName} làm Đồng sở hữu.`);
      }
  };

  const demoteUser = (userId: string) => {
      if (!user || user.role !== 'owner') return;
      const target = allUsers.find(u => u.id === userId);
      if (target) {
          updateUserInList({ ...target, role: 'user' });
          alert(`Đã cắt chức ${target.displayName} xuống Thành viên.`);
      }
  };

  return (
    <AuthContext.Provider value={{ 
        user, allUsers, login, register, forgotPassword, resetPassword, logout,
        updateProfile, toggleFavorite, toggleLike, sendThanks, isFavorite, hasLiked,
        deleteStory, deleteComment, promoteUser, demoteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};