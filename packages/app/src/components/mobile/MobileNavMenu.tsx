import { WhoAmIQuery } from '@/__generated__/graphqlTypes';
import React, { useState } from 'react';
import BasicMenuItem, { BasicMenu } from '../BasicMenu';
import { HamburgerMenu } from '../Icons';

interface MobileNavMenuProps {
  profile?: WhoAmIQuery['whoami'];
  handleLogout: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  profile,
  handleLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

  return (
    <>
      <button
        className="outline-offset-4 text-xl p-2"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <HamburgerMenu />
      </button>
      <BasicMenu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(undefined)}
      >
        <>
          {!profile && (
            <>
              <BasicMenuItem tag="a" href="/sign-in">
                Login
              </BasicMenuItem>
              <BasicMenuItem tag="a" href="/sign-up">
                Register
              </BasicMenuItem>
            </>
          )}
          <BasicMenuItem tag="a" href="/sign-up">
            Profile: <strong>{profile?.name || 'Guest'}</strong>
          </BasicMenuItem>
          {profile?.name && (
            <BasicMenuItem tag="button" onClick={handleLogout}>
              Logout
            </BasicMenuItem>
          )}
          <BasicMenuItem tag="a" href="/about">
            About
          </BasicMenuItem>
        </>
      </BasicMenu>
    </>
  );
};

export default MobileNavMenu;
