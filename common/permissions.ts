export enum ChapterPermission {
  ChapterEdit = 'chapter-edit',
  ChapterBanUser = 'chapter-ban-user',
  EventCreate = 'event-create',
  EventEdit = 'event-edit',
  EventDelete = 'event-delete',
  EventSendInvite = 'event-send-invite',
  EventSubscriptionManage = 'event-subscription-manage',
  Rsvp = 'rsvp',
  RsvpDelete = 'rsvp-delete',
  RsvpConfirm = 'rsvp-confirm',
  UsersView = 'users-view',
  VenueCreate = 'venue-create',
  VenueEdit = 'venue-edit',
  VenueDelete = 'venue-delete',
}

export enum InstancePermission {
  ChapterCreate = 'chapter-create',
  ChapterJoin = 'chapter-join',
  ChapterDelete = 'chapter-delete',
  ChaptersView = 'chapters-view',
  EventsView = 'events-view',
  VenuesView = 'venues-view',
  ChapterSubscriptionManage = 'chapter-subscription-manage',
  ChapterUserRoleChange = 'chapter-user-role-change',
  SponsorManage = 'sponsor-manage',
  SponsorView = 'sponsor-view',
  UserInstanceRoleChange = 'user-instance-role-change',
  GoogleAuthenticate = 'google-authenticate',
}

// Ideally this would be a new enum, but TS does not (to my knowledge) support
// that yet.
export const Permission = { ...InstancePermission, ...ChapterPermission };
