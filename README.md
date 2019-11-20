**Dependency**

Node version: 12.X.x

**Build and run GraphQL service**

npm install
node server.js

GraphQl service starts on http://localhost:4000/graphql

**Sample Queries**

_Fetch all data_
```
// Get all data
query{
  allianceInfo(allId: "EHM35770") {
    allianceId
    serviceHours
    throttle
    channel
    alliancePhone
    allianceName
    allianceCompanyUrl
    subCategory
    hasPreferredPharmacyFilter
    enableOutOfNetworkPopup
    turnOnPreferredPharmacyFilter
  }
  locations(zip: 44444) {
    zip
    ssacd
    stateAbbr
    countyName
    fipsCode
    cityName
    savingsAmount
    savingsLevel
    stateName
  }
  header {
    ID
    enable_ehmp
    menu_item_parent
    menu_order
    nav_label
    product_line
    title
    url
  }
  users {
    id
   fName
   lName
  }
}
```

```
// Fetch specific data
{
  allianceInfo(allId: "EHM35770") {
    allianceId
    alliancePhone
  }
  locations(zip: 44444) {
    ssacd
    stateAbbr
    countyName
  }
  header {
    title
    url
  }
  user(id: 1) {
    id
   fName
   lName
  }
}
```

``` 
//Mutation sample
mutation {
  addUser(user: {
    id: 1,
    fName: "Jhon",
    lName: “Snow”,
    dob: "10/10/1945",
  }) {
    success
  }
}
```

