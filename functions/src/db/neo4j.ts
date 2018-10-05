const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://hobby-khdldknhlicigbkenklmdfal.dbs.graphenedb.com:24786', neo4j.auth.basic("test", "b.IZSvc43dQbXa.KMsEveqgk5PS1spd"));
//const session = driver.session();

export { driver };