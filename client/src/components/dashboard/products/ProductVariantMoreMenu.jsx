import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import useLocales from '../../../hooks/useLocales';

// ----------------------------------------------------------------------

ProductVariantMoreMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default function ProductVariantMoreMenu({ onEdit, onDelete }) {
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
          <MenuItem onClick={onEdit} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={editFill} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('common.edit')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
          <MenuItem onClick={onDelete} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Icon icon={trash2Outline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('common.delete')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        </div>
      </Menu>
    </>
  );
}
