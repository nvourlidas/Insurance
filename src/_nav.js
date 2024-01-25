export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-Graph',
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
    icon: 'cib-Buffer',
    items: [
        {
          component: 'CNavItem',
          name: 'Όλα τα Συμβόλαια',
          to: '/Contracts',
        },
        {
          component: 'CNavItem',
          name: 'Ομαδικά',
          to: '/Omadika',
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
        {
          component: 'CNavItem',
          name: 'Ανα Κλάδο Ασφάλησης',
          to: '/AnaBranch',
        },
    ]
  },
  {
    component: 'CNavItem',
    name: 'Ζημίες',
    to: '/#',
    icon: 'cil-BalanceScale',
    items: [
      {
        component: 'CNavItem',
        name: 'Εισαγωγή Ζημίας',
        to: '/AddZimia',
      },
      {
        component: 'CNavItem',
        name: 'Μη Απεσταλμένα',
        to: '/MZimies',
      },
      {
        component: 'CNavItem',
        name: 'Απεσταλμένα',
        to: '/Zimies',
      },
    ]
  },
  {
    component: 'CNavItem',
    name: 'Ασφαλιστηκές',
    to: '/Asfal',
    icon: 'cil-Institution',
  },

  {
    component: 'CNavItem',
    name: 'Κλάδοι Ασφάλισης',
    to: '/Branches',
    icon: 'cil-Move',
  },

  {
    component: 'CNavItem',
    name: 'Έντυπα',
    to: '/Files',
    icon: 'cil-FolderOpen',
  },
]


