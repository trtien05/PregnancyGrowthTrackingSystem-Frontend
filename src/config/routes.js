const routes = {
  public: {
    home: '/',
    notFound: '/404',
    login: '/login',
    register: '/register',
    verifyEmail: '/verify-email',
    pricing: '/pricing',
    checkout: '/checkout/:id',
    blogs: '/blogs',
    blog: '/blogs/:id',
    blogToolWorksheet: '/blogs/tool-worksheet',
    blogToolDueDate: '/blogs/tool-due-date',
    blogToolOvulation: '/blogs/tool-ovulation',
    blogToolPregWeight: '/blogs/tool-preg-weight',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  customer: {
    profile: '/profile',
    profileInformation: '/profile/information',
    subscription: '/subscription',
    pregnancy: '/pregnancy',
    pregnancyFetus: '/pregnancy/:id',
    dashboard: '/dashboard',
    manageMomInfor: '/dashboard/manage-mom-infor',
    dashboardFetus: '/dashboard/fetus',
    paymentResult: '/confirm-payment',
  },
};

export default routes;