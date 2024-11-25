import { cache } from 'react';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const fetchSocialMediaPosts = cache(async () => {
  // Simulate API call
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
});

export default async function SocialMediaFeed() {
  const posts = await fetchSocialMediaPosts();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <FaTwitter className="text-blue-400" />;
      case 'facebook':
        return <FaFacebook className="text-blue-600" />;
      case 'instagram':
        return <FaInstagram className="text-pink-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="widget bg-black">
      <h2 className="widget-title text-orange-600">Social Media Feed</h2>
      <ul className="space-y-4">
        {posts.map((post, index) => (
          <li key={`social-${index}`} className="border-b pb-2">
            <div className="mb-2 flex items-center">
              {getPlatformIcon(post.platform)}
              <span className="ml-2 text-sm capitalize text-gray-500">
                {post.platform}
              </span>
            </div>
            <p className="mb-1">{post.content}</p>
            <span className="text-sm text-gray-500">{post.likes} likes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
