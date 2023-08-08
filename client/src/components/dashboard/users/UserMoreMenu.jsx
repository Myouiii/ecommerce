import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { paramCase } from 'change-case';
import lockFill from '@iconify/icons-eva/lock-fill';
import detailUser from '@iconify/icons-eva/person-delete-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import useLocales from '../../../hooks/useLocales';
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDetail: PropTypes.func,
  onLockAccount: PropTypes.func
};

// eslint-disable-next-line react/prop-types
export default function UserMoreMenu({ userId, onLockAccount, status }) {
  const { t } = useLocales();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div onMouseLeave={() => setIsOpen(false)}>
          {status !== 'locked' ? (
            <MenuItem onClick={onLockAccount} sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={lockFill} width={24} height={24} />
              </ListItemIcon>
              <ListItemText primary={t('dashboard.users.lock-account')} primaryTypographyProps={{ variant: 'body2' }} />
            </MenuItem>
          ) : (
            <MenuItem onClick={onLockAccount} sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={lockFill} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary={t('dashboard.users.unlock-account')}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          )}
          <MenuItem
            sx={{ color: 'text.secondary' }}
            component={RouterLink}
            to={`${PATH_DASHBOARD.app.users.root}/${paramCase(userId)}/edit`}
          >
            <ListItemIcon>
              <Icon icon={detailUser} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('dashboard.users.detail')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </div>
      </Menu>
    </>
  );
}
