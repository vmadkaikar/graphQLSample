const _ = require('lodash');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const fetch = require('node-fetch');
let fakeDB = {
  users: []
};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Mutation {
    addUser(user: UserInput): ResponsePayload
    updateUser(user: UserInput): ResponsePayload
  }

  type Query {
    allianceInfo(allId: String): AllianceInfo
    locations(zip: Int): [Location]
    header: [Header]
    users: [User]
    user(id: Int): User
  }
  
  type AllianceInfo {
    allianceId: String
    serviceHours: String
    throttle: String
    channel: String
    alliancePhone: String
    allianceName: String
    allianceCompanyUrl: String
    productLines: [String]
    subCategory: String
    hasPreferredPharmacyFilter: Boolean
    enableOutOfNetworkPopup: Boolean
    turnOnPreferredPharmacyFilter: Boolean
  }
  
  type Location {
    zip: String
    ssacd: String
    stateAbbr: String
    countyName: String
    fipsCode: String
    cityName: String
    savingsAmount: String
    savingsLevel: String
    stateName: String
  }
  
  type Header {
    ID: Int
    enable_ehmp: String
    menu_item_parent: String
    menu_order: Int
    nav_label: String
    product_line: String
    title: String
    url: String  
  }
  
  type User {
    id: Int
    fName: String  
    lName: String  
    dob: String  
  }
  
  type ResponsePayload {
    success: Boolean
  }
  
  input UserInput {
    id: Int
    fName: String  
    lName: String  
    dob: String  
  }

`);

// The root provides a resolver function for each API endpoint
let root = {
  allianceInfo: ({allId}) => {
    return fetch(`https://www.qa.ehealthmedicareplans.com/mcws/rs/alliance/call-service/v2/${allId}`, {
      headers: {strictSSL: false},
    })
      .then(res => res.json())
      .then(res => {
        return Object.assign({}, res.allianceInfo, {
          serviceHours: res.serviceHours,
          throttle: res.throttle,
          alliancePhone: res.allianceInfo.alliancePhone.phoneNumber,
        });
      });
  },
  locations: ({zip}) => {
    return fetch(`https://www.qa.ehealthmedicareplans.com/mcws/rs/locations/v2?zip=${zip}`)
      .then(res => res.json())
      .then(res => res.locationList);
  },
  header: () => {
    return fetch('https://www.qa.ehealthmedicare.com/wp-json/ehm/v1/menu/header/')
      .then(res => res.json());
  },
  users: () => fakeDB.users,
  user: ({id}) => _.find(fakeDB.users, {id}),
  addUser: ({user}) => {
    fakeDB.users.push(user);
    return {
      success: true
    };
  },
  updateUser: ({user}) => {
    let oUser = _.find(fakeDB.users, {id: user.id});
    if (oUser) {
      oUser.fName = user.fName;
      oUser.lName = user.lName;
      oUser.dob = user.dob;
      return {
        success: true
      };
    } else {
      return {
        success: false
      };
    }
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
