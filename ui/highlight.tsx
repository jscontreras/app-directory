import Link from 'next/link';

export const Highlight = ({
  children,
  colorClass = 'text-amber-400',
  href,
}: {
  children: React.ReactNode;
  colorClass?: string;
  href?: string;
}) => {
  if (href) {
    return (
      <Link className={colorClass} href={href}>
        {children}
      </Link>
    );
  } else {
    return <span className={colorClass}>{children}</span>;
  }
};
