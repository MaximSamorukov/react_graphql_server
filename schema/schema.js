const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((response) => response.data);
      }
    }
  })
});

const PositionType = new GraphQLObjectType({
  name: 'Position',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    salary: {
      type: GraphQLInt,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/positions/${parentValue.id}/users`)
          .then((response) => response.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    firstName: {
      type: GraphQLString,
    },
    age: {
      type: GraphQLInt,
    },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
    position: {
      type: PositionType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/positions/${parentValue.positionId}`)
          .then((response) => response.data);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString,
        }
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((response) => response.data);
      },
    },
    position: {
      type: PositionType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/positions/${args.id}`)
          .then((response) => response.data);
      },
    }
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        companyId: {
          type: GraphQLString,
        },
        positionId: {
          type: GraphQLString,
        }
      },
      resolve(parentValue, { age, firstName, companyId, positionId }) {
        return axios
          .post(`http://localhost:3000/users`, {
            age,
            firstName,
            positionId,
            companyId
          })
          .then((res) => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/users/${args.id}`)
          .then((res) => res.data);
      }
    },
    deleteCompany: {
      type: CompanyType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data);
      }
    },
    deletePosition: {
      type: PositionType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, args) {
        return axios
          .delete(`http://localhost:3000/positions/${args.id}`)
          .then((res) => res.data);
      }
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        description: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { description, name }) {
        return axios
          .post(`http://localhost:3000/companies`, {
            name,
            description,
          })
          .then((res) => res.data);
      }
    },
    addPosition: {
      type: PositionType,
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
        },
        salary: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve(parentValue, { title, salary }) {
        return axios
          .post(`http://localhost:3000/positions`, {
            title,
            salary,
          })
          .then((res) => res.data);
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        firstName: {
          type: GraphQLString,
        },
        age: {
          type: GraphQLInt,
        },
        companyId: {
          type: GraphQLString,
        },
        positionId: {
          type: GraphQLString,
        }
      },
      resolve(parentValue, args) {
        const { id, ...rest } = args;
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, {
            ...rest
          })
          .then((res) => res.data);
      }
    },
    updateCompany: {
      type: CompanyType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        name: {
          type: GraphQLString,
        },
        description: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        const { id, ...rest } = args;
        return axios
          .patch(`http://localhost:3000/companies/${args.id}`, {
            ...rest
          })
          .then((res) => res.data);
      }
    },
    updatePosition: {
      type: PositionType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        title: {
          type: GraphQLString,
        },
        salary: {
          type: GraphQLInt,
        },
      },
      resolve(parentValue, args) {
        const { id, ...rest } = args;
        return axios
          .patch(`http://localhost:3000/positions/${args.id}`, {
            ...rest
          })
          .then((res) => res.data);
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})