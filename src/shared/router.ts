export const pathKey = {
  root: '/',
  login: '/login/',
  register: '/register/',
  settings: '/settings/',
  home: '/',
  page404: '/404',

  article: {},

  profile: {
    root: '/profile/',
    byUsername: (username: string) => `/profile/${username}`,
    byUsernameFavorites: (username: string) => `/profile/${username}/favorites/`,
  },

  editor: {
    root: '/editor/',
    bySlug: (slug: string) => `/editor/${slug}`,
  },
} as const;
