import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PostsComponent() {
    const [userId, setUserId] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        profilePic: 'https://murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg', // Default profile image URL
    });
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            fetchProfileData(storedUserId);
            fetchPosts(); // Fetch posts on component mount
        }
    }, []);

    const fetchProfileData = async (userId) => {
          try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
            const { username, profilePic } = response.data;
            setFormData({
                username,
                profilePic: profilePic || 'https://murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg', // Ensure default image if profilePic is null
            });
            setFollowerCount(response.data.followers.length); // Assuming API provides followers as an array
            setFollowingCount(response.data.following.length); // Assuming API provides following as an array
        } catch (error) {
            console.error('Error fetching profile details:', error);
        }
    };
    

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/posts/');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const gridContainerStyle = {
        display: 'flex',
        height: '100vh',
    };

    const sidebarStyle = {
        width: '300px',
        backgroundColor: '#F0F2F5',
        padding: '20px',
        boxSizing: 'border-box',
        borderRight: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const profileInfoStyle = {
        textAlign: 'center',
        marginBottom: '20px',
    };

    const profilePicStyle = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        marginBottom: '10px',
        objectFit: 'cover',
    };

    const followerInfoStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
        width: '100%',
    };

    const followerDivStyle = {
        textAlign: 'center',
        flex: 1,
    };

    const followBtnStyle = {
        padding: '10px 20px',
        marginTop: '15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        backgroundColor: '#4CAF50',
        color: 'white',
        width: '100%',
    };

    const profileNavStyle = {
        marginTop: '20px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    };

    const navLinkStyle = {
        display: 'block',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        textDecoration: 'none',
        color: '#555',
        transition: 'background-color 0.3s',
        textAlign: 'center',
        marginBottom: '10px',
    };

    const navLinkHoverStyle = {
        backgroundColor: '#ddd',
    };

    const postsContainerStyle = {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const cardsContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
    };

    const cardStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out',
        color: '#555',
        flex: '1 1 calc(33.333% - 20px)',
        maxWidth: 'calc(33.333% - 20px)',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
    };

    const cardHoverStyle = {
        transform: 'scale(1.02)',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    };

    const cardHeaderStyle = {
        padding: '16px',
        borderBottom: '1px solid #ddd',
    };

    const cardHeaderH2Style = {
        margin: '0',
        fontSize: '1.5em',
    };

    const cardContentStyle = {
        padding: '16px',
    };

    const cardContentPStyle = {
        margin: '0',
        color: '#555',
    };

    return (
        <div style={gridContainerStyle}>
            {/* Sidebar similar to EditProfileComponent */}
            <div style={sidebarStyle}>
                <div style={profileInfoStyle}>
                    <img src={formData.profilePic} alt="Profile" style={profilePicStyle} />
                    <h2>{formData.username}</h2>
                    <div style={followerInfoStyle}>
                        <div style={followerDivStyle}>
                            <h3>Followers</h3>
                            <p>{followerCount}</p>
                        </div>
                        <div style={followerDivStyle}>
                            <h3>Following</h3>
                            <p>{followingCount}</p>
                        </div>
                    </div>
                    <button style={followBtnStyle} onClick={() => setIsFollowing(!isFollowing)}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
                <nav style={profileNavStyle}>
                    <Link to="/profile/posts" style={navLinkStyle}>My Blogs</Link>
                    <Link to="/profile/edit" style={navLinkStyle}>Edit Profile</Link>
                    <Link to="/profile/media" style={navLinkStyle}>Upload Media</Link>
                    <Link to="/profile/account" style={navLinkStyle}>Account</Link>
                </nav>
            </div>

            {/* Displaying Blogs */}
            <div style={postsContainerStyle}>
                <h1>Blogs</h1>
                <div style={cardsContainerStyle}>
                    {posts.map(post => (
                        <div key={post._id} style={cardStyle} onMouseEnter={(e) => e.currentTarget.style = cardHoverStyle} onMouseLeave={(e) => e.currentTarget.style = cardStyle}>
                            <div style={cardHeaderStyle}>
                                <h2 style={cardHeaderH2Style}>{post.title}</h2>
                            </div>
                            <div style={cardContentStyle}>
                                <p style={cardContentPStyle}>{post.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostsComponent;