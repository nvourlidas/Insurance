export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavItem',
    name: 'Πελάτες',
    to: '/Customers',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Συμβόλαια',
    to: '/Contracts',
    icon: 'cil-file',
    items: [
        {
          component: 'CNavItem',
          name: 'Όλα τα Συμβόλαια',
          to: '/Contracts',
        },
        {
          component: 'CNavItem',
          name: 'Προς Λήξη',
          to: '/Expire',
        },
        {
          component: 'CNavItem',
          name: 'Προς Πληρωμή',
          to: '/ToPay',
        },
        {
          component: 'CNavItem',
          name: 'Ανα Ασφαλιστική',
          to: '/AnaAsfal',
        },
    ]
  },
  {
    component: 'CNavItem',
    name: 'Ζημίες',
    to: '/#',
    icon: 'cil-dollar',
    items: [
      {
        component: 'CNavItem',
        name: 'Εισαγωγή Ζημίας',
        to: '/AddZimia',
      },
      {
        component: 'CNavItem',
        name: 'Όλες οι Ζημίες',
        to: '/Zimies',
      },
    ]
  },
]
