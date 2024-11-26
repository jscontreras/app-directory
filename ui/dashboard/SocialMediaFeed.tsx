import styles from './SocialMediaFeed.module.css';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const fetchSocialMediaPosts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    {
      platform: 'twitter',
      content: 'Exciting news coming soon! #StayTuned',
      likes: 45,
    },
    {
      platform: 'facebook',
      content: 'Check out our latest product launch!',
      likes: 89,
    },
    {
      platform: 'instagram',
      content: 'Behind the scenes at our annual conference',
      likes: 132,
    },
  ];
};

export default async function SocialMediaFeed() {
  const posts = await fetchSocialMediaPosts();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <FaTwitter className={styles.twitterIcon} />;
      case 'facebook':
        return <FaFacebook className={styles.facebookIcon} />;
      case 'instagram':
        return <FaInstagram className={styles.instagramIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Social Media Feed</h2>
      <ul className={styles.list}>
        {posts.map((post, index) => (
          <li key={`social-${index}`} className={styles.item}>
            <div className={styles.header}>
              {getPlatformIcon(post.platform)}
              <span className={styles.platform}>{post.platform}</span>
            </div>
            <p className={styles.content}>{post.content}</p>
            <span className={styles.likes}>{post.likes} likes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
