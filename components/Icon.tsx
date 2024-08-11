/**
 * Material Symbols
 */

import type React from 'react';

/**
 * Icon names used in figma
 * @ref https://www.figma.com/design/wrgkgbbPtaopquHMRoBXnB/Open165?node-id=13-16816&t=zzmaVfrUCCRyWrCJ-4
 * @ref https://fonts.google.com/icons
 */
type Name = 'info' | 'search' | 'open_in_new';

type Props = React.ComponentPropsWithoutRef<'span'> & {
  name: Name;
  /**
   * Optical size. Defaults to 24 (set in global.css).
   * @ref https://developers.google.com/fonts/docs/material_symbols#opsz_axis
   */
  opsz?: number;
};

function Icon({ name, className, style: propStyle, opsz, ...props }: Props) {
  const style =
    opsz === undefined
      ? propStyle
      : {
          ...propStyle,
          fontVariationSettings: `'opsz' ${opsz}`,
          fontSize: `${opsz}px`,
        };

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      {...props}
    >
      {name}
    </span>
  );
}

export default Icon;
