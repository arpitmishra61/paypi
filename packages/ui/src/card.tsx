import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href?: string;
}): JSX.Element {
  return (
    <div className="rounded-lg bg-white shadow-md hover:shadow-lg transition p-6">
      <a
        className={className}
        rel="noopener noreferrer"
        target="_blank"
      >
        <h2>
          {title} <span>-&gt;</span>
        </h2>
        <p>{children}</p>
      </a>
    </div>
  );
}
