import { WhoAmIQuery } from '@/__generated__/graphqlTypes';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CrossIcon, HamburgerMenu } from '../Icons';
import Modal from '../Modal';

interface MobileNavProps {
  profile?: WhoAmIQuery['whoami'];
  handleLogout: () => void;
}
const MobileNavModal = ({ profile, handleLogout }: MobileNavProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="block md:hidden outline-offset-4"
        aria-label="mobile menu"
        onClick={() => setShowModal(true)}
      >
        <HamburgerMenu />
      </button>
      {showModal ? (
        <Modal
          onClose={() => setShowModal(false)}
          classes={{
            childrenContainer: 'modal__children-container',
            childrenOuter: 'w-full',
          }}
          autoFocus
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center">
                <h2>Auths Demo</h2>
                <button onClick={() => setShowModal(false)} className="p-1">
                  <CrossIcon fontSize="1.4rem" />
                </button>
              </div>
              <ul>
                <li>
                  <Link to="/about" className="underline">
                    about
                  </Link>
                </li>
                <li>
                  <Link to="/sign-in" className="underline">
                    sign-in
                  </Link>
                </li>
                <li>
                  <Link to="/sign-up" className="underline">
                    sign-up
                  </Link>
                </li>
                <li>
                  Profile: <strong>{profile?.name || 'Guest'}</strong>
                </li>
                <li>
                  {profile?.name && (
                    <button onClick={handleLogout} className="ml-4 teal-btn">
                      log out
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
export default MobileNavModal;
