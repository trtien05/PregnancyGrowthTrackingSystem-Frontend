const routes = {
  public: {
    home: '/',
    notFound: '/404',
    login: '/login',
    register: '/register',
    verifyEmail: '/verify-email',
    pricing: '/pricing',
    checkout: '/checkout',
    blogs: '/blogs',
    blog: '/blogs/:id',
    blogToolWorksheet: '/blogs/tool-worksheet',
    blogToolDueDate: '/blogs/tool-due-date',
    blogToolOvulation: '/blogs/tool-ovulation',
    blogToolPregWeight: '/blogs/tool-preg-weight',
  },
  customer: {
    profile: '/profile',
    dashboard: '/dashboard',
    manageMomInfor: '/dashboard/manage-mom-infor',
    dashboardFetus: '/dashboard/fetus',

  },
};

export default routes;