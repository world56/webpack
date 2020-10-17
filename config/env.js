const IsDev = process.env.NODE_DEV === "development";
const IsProduction = process.env.NODE_DEV === "production";

module.exports = {
  IsDev,
  IsProduction,
};
