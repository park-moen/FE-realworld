import { ASSETS } from '~shared/config/assets';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  priority?: boolean;
  className?: string;
}

export function Avatar({ src, alt, size = 'md', priority = false, className }: AvatarProps) {
  const sizeConfig = {
    sm: { className: 'user-pic', width: 26, height: 26 },
    md: { className: 'comment-author-img', width: 36, height: 36 },
    lg: { className: 'user-img', width: 100, height: 100 },
  };
  const config = sizeConfig[size];

  return (
    <img
      src={src || ASSETS.IMAGES.DEFAULT_AVATAR}
      alt={alt}
      className={className ?? config.className}
      width={config.width}
      height={config.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}
