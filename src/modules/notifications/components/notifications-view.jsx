import React, { Component } from "react";
import PropTypes from "prop-types";

import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import Notification from "modules/notifications/components/notification";

import getValue from "utils/get-value";
import { CloseBlack } from "modules/common/components/icons";

import Styles from "modules/notifications/components/notifications-view.styles.less";

export default class NotificationsView extends Component {
  static propTypes = {
    notifications: PropTypes.object.isRequired,
    updateNotification: PropTypes.func.isRequired,
    removeNotification: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    const notifications = getValue(this.props, "notifications.notifications");
    const { updateNotification } = this.props;
    notifications.forEach(notification => {
      updateNotification(notification.id, { seen: true });
    });
  }

  render() {
    const { removeNotification, toggleNotifications } = this.props;

    const notifications = getValue(this.props, "notifications.notifications");
    return (
      <section id="notifications_view" className={Styles.NotificationsView}>
        <button
          className={Styles.Notification__close}
          onClick={e => {
            e.stopPropagation();
            toggleNotifications();
          }}
        >
          {CloseBlack}
        </button>
        {notifications && notifications.length ? (
          <div
            ref={notifications => {
              this.notifications = notifications;
            }}
            className={Styles.NotificationsView__box}
          >
            {notifications.map((notification, i) => (
              <Notification
                key={`${notification.id}-${notification.title}`}
                removeNotification={() => removeNotification(notification.id)}
                toggleNotifications={toggleNotifications}
                {...notification}
              />
            ))}
          </div>
        ) : (
          <NullStateMessage
            className={Styles.NullStateMessage}
            message="No Notifications"
          />
        )}
      </section>
    );
  }
}
