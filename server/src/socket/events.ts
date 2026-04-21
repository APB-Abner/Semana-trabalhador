export const ClientEvents = {
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_VIEW: 'room:view',
  GAME_START: 'game:start',
  ROUND_NEXT: 'round:next',
  ANSWER_SUBMIT: 'answer:submit',
  ROOM_LEAVE: 'room:leave',
} as const;

export const ServerEvents = {
  ROOM_STATE: 'room:state',
  PRESENCE_UPDATE: 'presence:update',
  ROUND_OPENED: 'round:opened',
  ROUND_REVEALED: 'round:revealed',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  GAME_FINISHED: 'game:finished',
  ROOM_ERROR: 'room:error',
} as const;
