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
          to: '/Expire',
        },
        {
          component: 'CNavItem',
          name: 'Ανα Ασφαλιστική',
          to: '/AnaAsfal',
        },
    ]
  },
]
