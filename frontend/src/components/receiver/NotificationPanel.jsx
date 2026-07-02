import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { markAllNotificationsRead, markNotificationRead } from '../../store/notificationSlice'

function NotificationPanel({ notifications, loading, onNotificationClick }) {
  const dispatch = useDispatch()

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead())
  }

  const handleClick = (notification) => {
    if (!notification.is_read) {
      dispatch(markNotificationRead(notification.id))
    }
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!notifications.length) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          No notifications yet. You&apos;ll be notified when donors create new food events.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button size="small" onClick={handleMarkAllRead}>
          Mark all as read
        </Button>
      </Box>
      <List disablePadding>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            disablePadding
            sx={{
              mb: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: notification.is_read ? 'transparent' : 'action.hover',
            }}
          >
            <ListItemButton onClick={() => handleClick(notification)}>
              <ListItemText
                primary={
                  <Typography fontWeight={notification.is_read ? 400 : 700}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" component="span" display="block">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" component="span">
                      {dayjs(notification.created_at).format('DD MMM YYYY, hh:mm A')}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NotificationPanel
