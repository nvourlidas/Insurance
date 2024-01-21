export default [
  {
    component: 'CNavItem',
    name: 'Χρήστες',
    to: '/#',
    icon: 'cil-User',
    items: [
        {
          component: 'CNavItem',
          name: 'Όλοι οι Χρήστες',
          to: '/Users',
        },
        {
          component: 'CNavItem',
          name: 'Εισαγωγή Χρήστη',
          to: '/AddUser',
        },
    ],
  },
  {
    component: 'CNavItem',
    name: 'Διεγραμμένα',
    to: '/Contracts',
    icon: 'cil-Trash',
    items: [
        {
          component: 'CNavItem',
          name: 'Συμβόλαια',
          to: '/DelContracts',
        },
        {
          component: 'CNavItem',
          name: 'Πελάτες',
          to: '/DelCustomers',
        },
    ],
  },
]
