import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import debounce from "utils/debounce";
import { AlertCircle, CloseBlack } from "modules/common/components/icons/icons";
import Styles from "modules/notifications/components/notification.styles";
type NotificationProps = {
  index: number,
  seen: boolean,
  id: string,
  title: string,
  description: string,
  removeNotification: (...args: any[]) => any,
  toggleNotifications: (...args: any[]) => any,
  updateNotification: (...args: any[]) => any,
  notificationsBounds: object,
  updateNotificationsBoundingBox: (...args: any[]) => any,
  checkSeen: boolean,
  linkPath?: string | object
};
type NotificationState = {
  notificationBounds: any,
  notificationBounds: {}
};
export default class Notification extends Component<
  NotificationProps,
  NotificationState
> {
  constructor(props) {
    super(props);
    this.state = {
      notificationBounds: {}
    };
    this.updateNotificationBoundingBox = debounce(
      this.updateNotificationBoundingBox.bind(this),
      100
    );
    this.hasNotificationBeenSeen = this.hasNotificationBeenSeen.bind(this);
  }
  componentDidMount() {
    this.updateNotificationBoundingBox();
    window.addEventListener("scroll", this.updateNotificationBoundingBox);
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.state.notificationBounds !== nextState.notificationBounds) {
      this.props.updateNotificationsBoundingBox();
    }
    if (
      this.props.notificationsBounds !== nextProps.notificationsBounds ||
      this.state.notificationBounds !== nextState.notificationBounds
    ) {
      this.hasNotificationBeenSeen(
        nextProps.notificationsBounds,
        nextState.notificationBounds
      );
    }
    if (this.props.checkSeen !== nextProps.checkSeen && nextProps.checkSeen) {
      this.updateNotificationBoundingBox();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.updateNotificationBoundingBox);
  }
  updateNotificationBoundingBox() {
    if (this.notification)
      this.setState({
        notificationBounds: this.notification.getBoundingClientRect()
      });
  }
  hasNotificationBeenSeen(notificationsBounds, notificationBounds) {
    if (
      !this.seen &&
      notificationsBounds.top &&
      notificationsBounds.bottom &&
      notificationBounds.top &&
      notificationBounds.bottom
    ) {
      const topBound = notificationsBounds.top;
      const bottomBound = notificationsBounds.bottom;
      const notificationMidpoint =
        (notificationBounds.top + notificationBounds.bottom) / 2;
      if (
        notificationMidpoint >= topBound &&
        notificationMidpoint <= bottomBound
      ) {
        setTimeout(() => {
          this.props.updateNotification(this.props.id, { seen: true });
        }, 1000);
      }
    }
  }
  render() {
    const p = this.props;
    return (
      <article
        ref={notification => {
          this.notification = notification;
        }}
        className={Styles.Notification}
      >
        <Link
          className={Styles.Notification__link}
          to={p.linkPath ? p.linkPath : ""}
          onClick={e => {
            e.stopPropagation();
            if (!p.linkPath) e.preventDefault();
            if (p.linkPath && p.onClick) p.toggleNotifications();
          }}
        >
          <span className={Styles.Notification__title}>{p.title}</span>
          {AlertCircle(
            !p.seen
              ? Styles.Notification__dot
              : Styles["Notification__dot-seen"],
            "#553580"
          )}
          <button
            className={Styles.Notification__close}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              p.removeNotification();
            }}
          >
            {CloseBlack}
          </button>
          <span className={Styles.Notification__description}>
            {p.description}
          </span>
          <span className={Styles.Notification__time}>
            {moment.unix(p.timestamp).fromNow()}
          </span>
        </Link>
      </article>
    );
  }
}
