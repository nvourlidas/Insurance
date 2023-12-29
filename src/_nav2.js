export default [
  {
    component: 'CNavItem',
    name: 'Διεγραμμένα',
    to: '/Contracts',
    icon: 'cil-Trash',
    items: [
        {
          component: 'CNavItem',
          name: 'Συμβόλαια',
          to: '/Contracts',
        },
        {
          component: 'CNavItem',
          name: 'Πελάτες',
          to: '/Expire',
        },
    ]
  },
]
