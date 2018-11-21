const { DataSource } = require("apollo-datasource");

export default class neoAPI extends DataSource {
  constructor({ driver }: { driver: any }) {
    console.log("neoAPI constructor");
    super();

    this.session = driver.session();
  }

  initialize(config: any) {
    this.context = config.context;
  }

  findUser({ id, hostId }: { id: string; hostId: string }) {
    if (id) {
      return this.session
        .run(`Match (n:User {id: '${id}'}) RETURN n`)
        .then((result: any) => result.records)
        .then((records: any) => {
          console.log("records: ", records);
          if (!records.length) {
            return null;
          }
          const properties = records[0]._fields[0].properties;
          return {
            ...properties,
            profilePic: !!properties.pics ? properties.pics[0] : null,
            hostId: !!hostId ? hostId : null
          };
        })
        .catch((e: string) => console.log("id lookup error: ", e));
    } else {
      console.log("Error, no id inputted!");
      return null;
    }
  }
}
