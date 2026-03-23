'use client'

import React from 'react';
import Link from 'next/link';
import { useCMS } from '../../context/CMSContext';

interface EditableLinkProps {
  id: string;
  defaultHref: string;
  className?: string;
  /** Extra classes applied to the URL input — useful for dark backgrounds */
  inputClassName?: string;
  children: React.ReactNode;
}

/**
 * A link whose href is stored in the CMS.
 * In edit mode it renders the children + an inline URL field.
 * In view mode it renders as a Next.js <Link> (internal) or <a> (external).
 */
export const EditableLink = ({
  id,
  defaultHref,
  className,
  inputClassName: _inputClassName,
  children,
}: EditableLinkProps) => {
  const { isEditing, getContent, canEditKey } = useCMS();
  const hrefRaw = getContent(id, defaultHref);
  const href = typeof hrefRaw === 'string' ? hrefRaw : defaultHref;
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const editable = isEditing && canEditKey(id);

  if (editable) {
    // In edit mode, render a non-navigating wrapper so clicks open
    // the text/redirection editor instead of changing page.
    return <div className={className}>{children}</div>;
  }

  if (isExternal) {
    return (
      <a href={href || defaultHref} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href || defaultHref} className={className}>
      {children}
    </Link>
  );
};
